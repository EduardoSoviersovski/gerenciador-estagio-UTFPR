import logging
from datetime import date

from fastapi import Response, UploadFile, HTTPException, status

from core.exceptions.database_exceptions import DocumentNotFoundError
from core.exceptions.document_exceptions import DocumentTemplateDoesNotExistError
from core.schemas.document_schemas import DocumentStatus, EmptyDocument, DocumentType
from core.schemas.role_schemas import User, UserRole
from core.tasks.file_formatter_tasks import FileFormatterTasks
from core.tasks.document_tasks import DocumentTasks
from core.tasks.process_tasks import ProcessTasks
from core.tasks.workload_tasks import WorkloadTasks

logger = logging.getLogger(__name__)

class DocumentUseCases:
    @staticmethod
    def convert_file_to_jpg(upload_file: UploadFile) -> bytes:
        content_type = upload_file.content_type

        if content_type == "application/pdf":
            return FileFormatterTasks.convert_pdf_to_jpg(upload_file)
        return FileFormatterTasks.convert_image_to_jpg(upload_file)

    @staticmethod
    def save_document(file_bytes: bytes, process_id: int, document_type_id: int, original_filename: str, custom_name: str = None) -> None:
        DocumentTasks.save_document(
            process_id=process_id,
            document_type_id=document_type_id,
            file_content=file_bytes,
            original_filename=original_filename,
            custom_name=custom_name
        )

    @staticmethod
    def get_document(document_id: int) -> dict:
        return DocumentTasks.get_document(document_id)

    @classmethod
    def get_process_documents(cls, process_id: int) -> list:
        process = ProcessTasks.get_process_by_id(process_id)

        start_date = process.get("start_date")
        hour_goal = WorkloadTasks.get_active_hour_goal(process_id)
        if not hour_goal:
            raise ValueError("Hour Goal not found")

        weekly_hours = hour_goal["weekly_hours"]
        end_date = hour_goal["end_date_forecast"]

        first_partial_report_due_date = WorkloadTasks.get_partial_report_due_date(start_date, end_date, 6)
        second_partial_report_due_date = WorkloadTasks.get_partial_report_due_date(start_date, end_date, 12)

        raw_expected_dates = {
            DocumentType.STUDENT_PARTIAL_REPORT_1.value: first_partial_report_due_date,
            DocumentType.SUPERVISOR_PARTIAL_REPORT_1.value: first_partial_report_due_date,
            DocumentType.VISIT_REPORT.value: WorkloadTasks.get_visit_report_due_date(process, start_date, weekly_hours),
            DocumentType.STUDENT_PARTIAL_REPORT_2.value: second_partial_report_due_date,
            DocumentType.SUPERVISOR_PARTIAL_REPORT_2.value: second_partial_report_due_date,
            DocumentType.FINAL_REPORT.value: end_date,
        }
        expected_dates = {k: v for k, v in raw_expected_dates.items() if v is not None}
        existing_documents = DocumentTasks.get_process_documents(process_id)

        all_docs = WorkloadTasks.add_expected_due_dates(existing_documents, expected_dates, process_id)

        all_docs.sort(key=lambda x: x.get("expected_date", "9999-12-31"))
        return all_docs

    @staticmethod
    def get_document_messages(document_id: int) -> list:
        return DocumentTasks.get_document_messages(document_id)

    @staticmethod
    def save_document_template(
        file_bytes: bytes,
        document_type_id: int,
        file_name: str,
        mime_type: str,
        template_type: str
    ) -> None:
        DocumentTasks.save_document_template(
            document_type_id=document_type_id,
            file_content=file_bytes,
            file_name=file_name,
            mime_type=mime_type,
            template_type=template_type
        )

    @staticmethod
    def get_all_document_templates(template_type: str = None) -> list:
        return DocumentTasks.get_all_document_templates(template_type)

    @staticmethod
    def get_document_template_by_type_id(document_type_id: int) -> dict:
        template = DocumentTasks.get_document_template_by_type_id(document_type_id)
        if not template:
            raise DocumentTemplateDoesNotExistError()
        return template

    @staticmethod
    def add_comment_to_report(process_id: int, document_type_id: int, message: str, user_id: int, user_role: str, document_id: int = None) -> dict:

        document_id = document_id or DocumentTasks.create_empty_document(
            process_id,
            document_type_id,
            DocumentStatus.PENDING.value
        )
        if not document_id:
            raise HTTPException(status_code=500, detail="Error to create base document for the report")

        message_id = DocumentTasks.insert_document_message(document_id, message, user_id)
        
        return {
            "message": "Comment added successfully",
            "document_id": document_id,
            "message_id": message_id,
            "role": user_role  
        }

    @classmethod
    def get_report_message_list(cls, document_id: int) -> dict:
        try:
            document = cls.get_document(document_id)
        except DocumentNotFoundError:
            logger.info("Document not found.", extra={"document_id": document_id})
            return {
                "document": None,
                "messages": []
            }
        
        doc_data = document.copy()
        doc_data.pop('file_content', None)

        messages = cls.get_document_messages(document_id)

        return {
            "document": doc_data,
            "messages": messages
        }

    @staticmethod
    def update_report_status(
        process_id: int,
        document_type_id: int,
        status_id: int,
        user_role: str,
        document_id: int = None,
        new_hour_goal: int | None = None,
        new_weekly_hours: int | None = None,
        additive_start_date: date | None = None,
    ) -> dict:
        logger.info(
            "Updating report status",
            extra={
                "process_id": process_id,
                "document_type_id": document_type_id,
                "status_id": status_id,
                "document_id": document_id,
                "user_role": user_role,
            },
        )

        if user_role.lower() not in [UserRole.ADMIN.value, UserRole.ADVISOR.value]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Ação restrita. Apenas Administradores e Orientadores podem adicionar comentários."
            )

        is_additive_plan_approval = (
            document_type_id == DocumentType.ADDITIVE_PLAN.value
            and status_id == DocumentStatus.APPROVED.value
        )

        is_additive_plan_rejection = (
            document_type_id == DocumentType.ADDITIVE_PLAN.value
            and status_id == DocumentStatus.REJECTED.value
        )

        target_document_id, current_document_status = DocumentUseCases._resolve_target_document(
            process_id=process_id,
            document_type_id=document_type_id,
            status_id=status_id,
            document_id=document_id,
        )

        if is_additive_plan_approval:
            if user_role.lower() != UserRole.ADMIN.value:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Only administrators can approve additive plans."
                )

            if new_hour_goal is None or new_weekly_hours is None:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail="To approve an additive plan, provide both a new hour goal and new weekly hours."
                )

            active_hour_goal = WorkloadTasks.get_active_hour_goal(process_id)
            if not active_hour_goal:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Active hour goal not found for this process."
                )

            process = ProcessTasks.get_process_by_id(process_id)
            additive_start_date = additive_start_date or active_hour_goal["end_date_forecast"]
            forecast_end_date = WorkloadTasks.calculate_forecast_end_date(
                additive_start_date,
                new_weekly_hours,
                new_hour_goal,
            )

            process_max_end_date = WorkloadTasks.add_months(process["start_date"], 24)
            if forecast_end_date > process_max_end_date:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=(
                        f"A previsão de fim ({forecast_end_date.isoformat()}) ultrapassa o limite de 2 anos "
                        f"do estágio ({process_max_end_date.isoformat()}). Não é permitido aprovar com a data de início informada."
                    )
                )

            ProcessTasks.create_hour_goal(
                process_id,
                new_hour_goal,
                new_weekly_hours,
                forecast_end_date,
                source_document_id=target_document_id,
            )
            logger.info(
                "Approved additive plan and created new active hour goal",
                extra={
                    "process_id": process_id,
                    "document_id": target_document_id,
                    "new_hour_goal": new_hour_goal,
                    "new_weekly_hours": new_weekly_hours,
                    "additive_start_date": additive_start_date.isoformat(),
                    "forecast_end_date": forecast_end_date.isoformat(),
                },
            )

        if is_additive_plan_rejection:
            DocumentUseCases._validate_additive_rejection_link(
                process_id=process_id,
                target_document_id=target_document_id,
            )

            if current_document_status == DocumentStatus.APPROVED.value:
                DocumentUseCases._rollback_additive_hour_goal(
                    process_id=process_id,
                    target_document_id=target_document_id,
                )
                logger.info(
                    "Rejected approved additive plan and rolled back active hour goal",
                    extra={"process_id": process_id, "document_id": target_document_id},
                )

        DocumentTasks.update_document_status(target_document_id, status_id)

        return {
            "message": "Status updated successfully",
            "document_id": target_document_id,
            "status_id": status_id
        }

    @staticmethod
    def _resolve_target_document(process_id: int, document_type_id: int, status_id: int, document_id: int | None) -> tuple[int, int]:
        if document_id:
            doc = DocumentTasks.get_document(document_id)
            if doc["process_id"] != process_id or doc["document_type_id"] != document_type_id:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail="Provided document_id is not linked to this process/document type."
                )
            return document_id, doc["status_id"]

        existing_document = DocumentTasks.get_document_by_process_and_type(process_id, document_type_id)
        if existing_document:
            return existing_document["id"], existing_document["status_id"]

        if document_type_id == DocumentType.ADDITIVE_PLAN.value:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Upload the additive plan document before updating its status."
            )

        created_document_id = DocumentTasks.create_empty_document(
            process_id,
            document_type_id,
            status_id
        )
        if not created_document_id:
            raise HTTPException(status_code=500, detail="Error creating base document to the report")
        return created_document_id, status_id

    @staticmethod
    def _rollback_additive_hour_goal(process_id: int, target_document_id: int) -> None:
        active_hour_goal = WorkloadTasks.get_active_hour_goal(process_id)
        if not active_hour_goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Active hour goal not found for this process."
            )

        if active_hour_goal.get("source_document_id") != target_document_id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Cannot reject this approved additive plan because the current forecast is not linked to this document."
            )

        previous_hour_goal = ProcessTasks.get_previous_hour_goal(process_id, active_hour_goal["id"])
        if not previous_hour_goal:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Cannot reject approved additive plan because there is no previous forecast to restore."
            )

        ProcessTasks.set_hour_goal_active(active_hour_goal["id"], False)
        ProcessTasks.set_hour_goal_active(previous_hour_goal["id"], True)

    @staticmethod
    def _validate_additive_rejection_link(process_id: int, target_document_id: int) -> None:
        active_hour_goal = WorkloadTasks.get_active_hour_goal(process_id)
        if not active_hour_goal:
            return

        source_document_id = active_hour_goal.get("source_document_id")
        if source_document_id and source_document_id != target_document_id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Cannot reject this approved additive plan because the current forecast is not linked to this document."
            )

    @staticmethod
    def get_additive_plan_defaults(process_id: int, current_user: User) -> dict:
        ProcessTasks.verify_process_access(process_id=process_id, current_user=current_user)
        process = ProcessTasks.get_process_by_id(process_id)
        hour_goal = WorkloadTasks.get_active_hour_goal(process_id)

        if not hour_goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Active hour goal not found for this process."
            )

        return {
            "new_hour_goal": hour_goal["target_hours"],
            "new_weekly_hours": hour_goal["weekly_hours"],
            "additive_start_date": hour_goal["end_date_forecast"],
            "max_additive_start_date": WorkloadTasks.add_months(process["start_date"], 24),
        }

    @classmethod
    def upload_pdf_document(cls, process_id: int, document_type_id: int, file: UploadFile, current_user: User, custom_name: str = None, document_id: int = None) -> dict:
        ProcessTasks.verify_process_access(process_id=process_id, current_user=current_user)

        file_bytes = file.file.read()
        cls._verify_file_integrity(file_bytes)

        original_filename = file.filename or "documento_sem_nome.pdf"
        logger.info(
            "Uploading PDF document",
            extra={
                "process_id": process_id,
                "document_type_id": document_type_id,
                "document_id": document_id,
                "file_name": original_filename,
            },
        )

        upsert_result = DocumentTasks.upsert_pdf_document(
            process_id=process_id,
            document_type_id=document_type_id,
            file_content=file_bytes,
            original_filename=original_filename,
            custom_name=custom_name,
            document_id=document_id
        )

        return {
            "message": upsert_result["message"],
            "document_id": upsert_result["document_id"],
            "document_type_id": document_type_id,
            "file_name": original_filename
        }
    
    @classmethod
    def download_document(cls, process_id: int,document_id: int, file_format: str, current_user: User) -> Response:
        ProcessTasks.verify_process_access(process_id=process_id, current_user=current_user)
        document = cls.get_document(document_id)

        file_bytes = document.get("file_content")
        original_filename = document.get("file_name", "document_name")

        if not file_bytes or document.get("mime_type") == EmptyDocument.MIME_TYPE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This document does not have a file attached to it."
            )

        requested_format = file_format.lower()
        if requested_format not in ["pdf", "jpg", "jpeg"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file format requested. Supported formats are: pdf, jpg, jpeg."
            )

        if requested_format in ["jpg", "jpeg"]:
            file_bytes, media_type, filename = cls._convert_pdf_to_image(file_bytes, original_filename)
        else:
            media_type = "application/pdf"
            filename = original_filename if original_filename.lower().endswith(".pdf") else f"{original_filename}.pdf"

        return Response(
            content=file_bytes,
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )

    @staticmethod
    def _convert_pdf_to_image(file_bytes: bytes, original_filename: str) -> tuple[bytes, str, str]:
        try:
            file_bytes = FileFormatterTasks.convert_pdf_bytes_to_jpg(file_bytes)
            media_type = "image/jpeg"
            filename = original_filename if not original_filename.lower().endswith(".jpg") else f"{original_filename[:-4]}.jpg"
            return file_bytes, media_type, filename

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error converting document to JPG: {str(e)}"
            )

    @staticmethod
    def _verify_file_integrity(file_bytes: bytes) -> bool:
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The file is empty"
            )

        if not file_bytes.startswith(b'%PDF'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid format. The file must be a valid PDF document."
            )
        return True