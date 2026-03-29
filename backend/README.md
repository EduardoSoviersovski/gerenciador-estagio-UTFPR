# Sistema de Controle de Processos de Estágio para PRAE da UTFPR
Repositório para o desenvolvimento de um sistema de controle de processos de estágio para a Pró-Reitoria de Assuntos Estudantis (PRAE) da Universidade Tecnológica Federal do Paraná (UTFPR). O sistema visa facilitar a gestão e acompanhamento dos processos de estágio, proporcionando uma interface intuitiva para estudantes, supervisores e administradores.

Este projeto é um Trabalho de Conclusão de Curso (TCC) desenvolvido pelos alunos Pedro Tortola e Eduardo Soviersovski.

# TO INSTALL
```bash
poetry install
```

## TO RUN
```bash
uvicorn main:app --reload
```

## TO CREATE DATABASE TABLES
Depois ter o banco de dados configurado, va para o diretorio backend e execute o seguinte comando para criar as tabelas necessárias:
```bash
python scripts/init_db.py
```

## TO POPULATE DATABASE WITH FAKE DATA
Depois ter as tabelas criadas, execute o seguinte comando para popular o banco de dados com dados falsos:
```bash
python scripts/seed_database.py
```
