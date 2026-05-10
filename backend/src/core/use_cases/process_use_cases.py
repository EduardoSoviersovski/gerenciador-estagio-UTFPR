from datetime import datetime, date

from core.schemas.process_schemas import CreateProcessRequest, UpdateProcessRequest
from core.schemas.role_schemas import UserRoleId
from core.tasks.authentication_tasks import AuthenticationTasks
from core.tasks.company_tasks import CompanyTasks
from core.tasks.document_tasks import DocumentTasks
from core.tasks.process_tasks import ProcessTasks
from core.tasks.workload_tasks import WorkloadTasks


class ProcessUseCases:
    @staticmethod
    def create_new_process(request: CreateProcessRequest) -> dict:
        student_id = AuthenticationTasks.get_or_create_user(
            name=request.student_name,
            email=request.student_email,
            phone=request.student_phone,
            role_id=UserRoleId.STUDENT.value,
            google_id=None,
            ra=request.student_ra,
        )["id"]

        advisor_id = AuthenticationTasks.get_or_create_user(
            name=request.advisor_name,
            email=request.advisor_email,
            phone=request.advisor_phone,
            role_id=UserRoleId.ADVISOR.value,
            ra=None,
            google_id=None,
        )["id"]

        company_id = CompanyTasks.get_or_create_company(
            name=request.company_name,
            cnpj=request.company_cnpj,
            supervisor_name=request.supervisor_name,
            supervisor_email=request.supervisor_email,
            supervisor_cpf=request.supervisor_cpf
        )["id"]

        internship_type_id = ProcessTasks.get_internship_type_id(request.category.value)

        process_payload = {
            "student_id": student_id,
            "advisor_id": advisor_id,
            "internship_type_id": internship_type_id,
            "sei_number": request.sei_number,
            "start_date": request.start_date,
            "company_id": company_id,
            "weekly_hours": request.weekly_hours,
        }
        return ProcessTasks.create_internship_process(process_payload)

    @staticmethod
    def create_hour_goal(process_id: int, weekly_hours: int, target_hours: int, start_date: date) -> dict:
        forecast_end_date = WorkloadTasks.calculate_forecast_end_date(start_date, weekly_hours, target_hours)
        return ProcessTasks.create_hour_goal(process_id, target_hours, forecast_end_date)

    @staticmethod
    def get_workload_stats(process: dict) -> dict:
        if not process:
            raise ValueError("Process not found")
        hour_goal = WorkloadTasks.get_active_hour_goal(process["id"])
        print(hour_goal)
        if not hour_goal:
            raise ValueError("Hour Goal not found")

        target = hour_goal['total_target_hours']

        current_date = date.today()

        hours_done = WorkloadTasks.calculate_fulfilled_hours(
            process['start_date'], current_date, process['weekly_hours']
        )

        return {
            "target_hours": target,
            "hours_completed": hours_done,
            "hours_remaining": max(0, target - hours_done),
            "estimated_end_date": hour_goal['end_date_forecast'],
            "completion_percentage": round((hours_done / target) * 100, 2)
        }

    @staticmethod
    def update_process(process_id: int, request: UpdateProcessRequest) -> dict:
        process = ProcessTasks.get_process_by_id(process_id)
        if not process:
            raise ValueError("Process not found")

        AuthenticationTasks.update_user(
            user_id=process["student_id"],
            name=request.student_name,
            email=request.student_email,
            phone=request.student_phone,
            ra=request.student_ra
        )

        AuthenticationTasks.update_user(
            user_id=process["advisor_id"],
            name=request.advisor_name,
            email=request.advisor_email,
            phone=request.advisor_phone,
            ra=None
        )

        CompanyTasks.update_company(
            company_id=process["company_id"],
            name=request.company_name,
            cnpj=request.company_cnpj,
            supervisor_name=request.supervisor_name,
            supervisor_email=request.supervisor_email,
            supervisor_cpf=request.supervisor_cpf
        )

        internship_type_id = ProcessTasks.get_internship_type_id(request.category.value)

        process_payload = {
            "internship_type_id": internship_type_id,
            "sei_number": request.sei_number,
            "start_date": request.start_date,
            "weekly_hours": request.weekly_hours,
        }
        updated_process = ProcessTasks.update_process(process_id, process_payload)

        forecast_end_date = WorkloadTasks.calculate_forecast_end_date(
            request.start_date,
            request.weekly_hours,
            request.target_hours
        )
        ProcessTasks.update_hour_goal(process_id, request.target_hours, forecast_end_date)

        return updated_process

    @staticmethod
    def delete_process(process_id: int) -> bool:
        process = ProcessTasks.get_process_by_id(process_id)
        if not process:
            return False

        DocumentTasks.delete_documents_by_process_id(process_id)

        WorkloadTasks.delete_hour_goals_by_process_id(process_id)

        return ProcessTasks.delete_process(process_id)