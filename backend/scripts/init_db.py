import os
from adapters.driven.database.mysql_adapter import MySQLAdapter


def run_init_script():
    db_url = os.getenv("DATABASE_URL", "mysql+pymysql://user:user_password@localhost/sisprae_db")

    adapter = MySQLAdapter(db_url)

    script_path = os.path.join(os.path.dirname(__file__), "init.sql")

    with open(script_path, 'r') as f:
        sql_commands = f.read().split(';')

    for command in sql_commands:
        if command.strip():
            try:
                adapter.execute_query(command)
                print("Comando executado com sucesso.")
            except Exception as e:
                print(f"Erro ao executar comando: {e}")


if __name__ == "__main__":
    run_init_script()
