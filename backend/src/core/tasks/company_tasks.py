from core.ports.company_ports import CompanyPorts


class CompanyTasks:
    @staticmethod
    def get_or_create_company(
        name: str,
        supervisor_name: str | None,
        supervisor_email: str | None,
    ) -> dict:
        if existing_company := CompanyPorts.get_company_by_name_and_supervisor(name, supervisor_name):
            return existing_company

        return CompanyPorts.create_company(name, supervisor_name, supervisor_email)

    @staticmethod
    def update_company(
        company_id: int,
        name: str,
        supervisor_name: str | None,
        supervisor_email: str | None,
    ) -> dict:
        return CompanyPorts.update_company(
            company_id=company_id,
            name=name,
            supervisor_name=supervisor_name,
            supervisor_email=supervisor_email,
        )
