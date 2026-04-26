import os
from adapters.database.mysql_adapter import MySQLAdapter


def run_init_script():
    adapter = MySQLAdapter()

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
