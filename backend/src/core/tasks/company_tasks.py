from core.ports.company_ports import CompanyPorts


class CompanyTasks:
    @staticmethod
    def get_or_create_company(
        name: str,
        cnpj: str | None,
        supervisor_name: str | None,
        supervisor_email: str | None,
        supervisor_cpf: str | None
    ) -> dict:
        if existing_company := CompanyPorts.get_company_by_name_and_supervisor(name, supervisor_name):
            return existing_company

        return CompanyPorts.create_company(name, cnpj, supervisor_name, supervisor_email, supervisor_cpf)

    @staticmethod
    def update_company(
        company_id: int,
        name: str,
        cnpj: str | None,
        supervisor_name: str | None,
        supervisor_email: str | None,
        supervisor_cpf: str | None
    ) -> dict:
        return CompanyPorts.update_company(
            company_id=company_id,
            name=name,
            cnpj=cnpj,
            supervisor_name=supervisor_name,
            supervisor_email=supervisor_email,
            supervisor_cpf=supervisor_cpf
        )
