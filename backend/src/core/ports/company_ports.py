from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.company_repo import GET_COMPANY_BY_NAME_AND_SUPERVISOR, INSERT_COMPANY

adapter = MySQLAdapter()

class CompanyPorts:
    @staticmethod
    def get_company_by_name_and_supervisor(name: str, supervisor_name: str):
        return adapter.fetch_one(GET_COMPANY_BY_NAME_AND_SUPERVISOR, (name, supervisor_name))

    @classmethod
    def create_company(cls, name: str, cnpj: str | None = None, supervisor_name: str | None = None, supervisor_email: str | None = None, supervisor_cpf: str | None = None):
        adapter.execute_query(
            INSERT_COMPANY,
    (name, cnpj, supervisor_name, supervisor_email, supervisor_cpf)
        )
        return cls.get_company_by_name_and_supervisor(name, supervisor_name)
