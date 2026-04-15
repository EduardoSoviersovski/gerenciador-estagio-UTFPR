from core.schemas.process_schemas import CreateProcessRequest
from core.schemas.role_schemas import UserRoleId
from core.tasks.process_tasks import ProcessTasks


class ProcessUseCases:
    @staticmethod
    def create_new_process(request: CreateProcessRequest) -> dict:
        student_id = ProcessTasks.get_or_create_user(
            name=request.student_name,
            email=request.student_email,
            phone=request.student_phone,
            role_id=UserRoleId.STUDENT.value,
            google_id=None,
            ra=request.student_ra,
        )["id"]

        advisor_id = ProcessTasks.get_or_create_user(
            name=request.advisor_name,
            email=request.advisor_email,
            phone=request.advisor_phone,
            role_id=UserRoleId.ADVISOR.value,
            ra=None,
            google_id=None,
        )["id"]

        internship_type_id = ProcessTasks.get_internship_type_id(request.category.value)

        process_payload = {
            "student_id": student_id,
            "advisor_id": advisor_id,
            "internship_type_id": internship_type_id,
            "sei_number": request.sei_number,
            "start_date": request.start_date
        }

        ProcessTasks.create_internship_process(process_payload)

        return {"message": "Internship process created successfully"}