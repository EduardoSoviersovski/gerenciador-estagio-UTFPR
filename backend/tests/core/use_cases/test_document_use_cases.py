import pytest
from core.use_cases.document_use_cases import DocumentUseCases

DOCUMENT_TYPE_ID = 1
DOCUMENT_TYPE_NAME = "partial_report"
MIME_TYPE = "application/pdf"


def test_document_template_insert_flow():
    file_content = b"Conteudo fake de um arquivo PDF para o banco de dados"
    file_name = "template_integracao_tcc.pdf"

    DocumentUseCases.save_document_template(
        file_bytes=file_content,
        document_type_id=DOCUMENT_TYPE_ID,
        file_name=file_name,
        mime_type=MIME_TYPE
    )

    retrieved_template = DocumentUseCases.get_document_template_by_type_id(DOCUMENT_TYPE_ID)
    _assert_template_saved_correctly(expected_file_name=file_name, expected_file_content=file_content, retrieved_template=retrieved_template)


def test_document_template_update_flow():
    initial_file_content = b"Conteudo inicial velho"
    initial_file_name = "template_velho.pdf"

    DocumentUseCases.save_document_template(
        file_bytes=initial_file_content,
        document_type_id=DOCUMENT_TYPE_ID,
        file_name=initial_file_name,
        mime_type=MIME_TYPE
    )
    new_file_content = b"Conteudo ATUALIZADO do template simulando nova versao"
    new_file_name = "template_atualizado_2026.pdf"

    DocumentUseCases.save_document_template(
        file_bytes=new_file_content,
        document_type_id=DOCUMENT_TYPE_ID,
        file_name=new_file_name,
        mime_type=MIME_TYPE
    )

    retrieved_template = DocumentUseCases.get_document_template_by_type_id(DOCUMENT_TYPE_ID)
    _assert_template_saved_correctly(expected_file_name=new_file_name, expected_file_content=new_file_content, retrieved_template=retrieved_template)


def _assert_template_saved_correctly(expected_file_name: str, expected_file_content: bytes, retrieved_template: dict):
    expected_file_size = len(expected_file_content)

    all_templates = DocumentUseCases.get_all_document_templates()
    saved_template = next(
        (t for t in all_templates if t["file_name"] == expected_file_name),
        None
    )

    assert saved_template is not None, f"O template {expected_file_name} não foi encontrado na listagem."
    assert saved_template["mime_type"] == MIME_TYPE
    assert saved_template["file_size"] == expected_file_size
    assert "document_type_name" in saved_template

    assert retrieved_template["file_name"] == expected_file_name, "O nome do arquivo não bate com o esperado."
    assert retrieved_template["mime_type"] == MIME_TYPE
    assert retrieved_template[
               "file_content"] == expected_file_content, "O conteúdo do arquivo (bytes) não foi salvo corretamente."

def test_get_document_template_by_type_id_not_found_integration():
    invalid_type_name = "relatorio_inexistente"

    with pytest.raises(ValueError, match=f"Template for document type '{invalid_type_name}' not found"):
        DocumentUseCases.get_document_template_by_type_id(invalid_type_name)
