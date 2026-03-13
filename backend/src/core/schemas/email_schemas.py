from enum import Enum


class AllowedEmailDomain(str, Enum):
    UTFPR = "utfpr.edu.br"
    UTFPR_STUDENTS = "alunos.utfpr.edu.br"
