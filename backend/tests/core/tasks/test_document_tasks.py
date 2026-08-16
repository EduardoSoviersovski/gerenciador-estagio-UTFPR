from unittest.mock import patch

import pytest

from core.exceptions.database_exceptions import DocumentNotFoundError
from core.schemas.document_schemas import DocumentType
from core.tasks.document_tasks import DocumentTasks


@patch("core.tasks.document_tasks.DocumentPorts")
def test_save_document_template_insert_flow(mock_ports):
    mock_ports.get_template_by_type_id_and_mime_type.return_value = None

    file_content = b"fake_pdf_bytes"

    DocumentTasks.save_document_template(
        document_type_id=DocumentType.OTHERS.value,
        file_content=file_content,
        file_name="termo.pdf",
        mime_type="application/pdf",
        template_type="DOCUMENT"
    )

    mock_ports.save_document_template.assert_called_once_with(
        document_type_id=DocumentType.OTHERS.value,
        file_content=file_content,
        file_name="termo.pdf",
        file_size=len(file_content),
        mime_type="application/pdf",
        template_type="DOCUMENT"
    )


@patch("core.tasks.document_tasks.DocumentPorts")
def test_save_document_template_update_flow(mock_ports):
    mock_ports.get_template_by_type_id.return_value = {"id": 10}

    new_content = b"updated_report_bytes"

    DocumentTasks.save_document_template(
        document_type_id=2,
        file_content=new_content,
        file_name="relatorio_parcial.pdf",
        mime_type="application/pdf",
        template_type="REPORT"
    )

    mock_ports.update_document_template.assert_called_once_with(
        document_type_id=2,
        file_content=new_content,
        file_name="relatorio_parcial.pdf",
        file_size=len(new_content),
        mime_type="application/pdf",
        template_type="REPORT"
    )


@patch("core.tasks.document_tasks.DocumentPorts")
def test_get_all_document_templates_with_template_type(mock_ports):
    DocumentTasks.get_all_document_templates(template_type="REPORT")

    mock_ports.get_all_document_templates.assert_called_once_with("REPORT")


@patch("core.tasks.document_tasks.DocumentPorts")
def test_upsert_pdf_document_overwrites_existing_document(mock_ports):
    mock_ports.get_document_by_id.return_value = {
        "id": 10,
        "process_id": 22,
        "document_type_id": 3,
    }

    result = DocumentTasks.upsert_pdf_document(
        process_id=22,
        document_type_id=3,
        file_content=b"%PDF-1.4\ncontent",
        original_filename="relatorio.pdf",
        custom_name="Relatorio Atualizado",
        document_id=10,
    )

    mock_ports.update_document_file.assert_called_once()
    assert result["document_id"] == 10
    assert "atualizado" in result["message"].lower()


@patch("core.tasks.document_tasks.DocumentPorts")
def test_upsert_pdf_document_raises_not_found_when_document_id_does_not_exist(mock_ports):
    mock_ports.get_document_by_id.return_value = None

    with pytest.raises(DocumentNotFoundError):
        DocumentTasks.upsert_pdf_document(
            process_id=22,
            document_type_id=3,
            file_content=b"%PDF-1.4\ncontent",
            original_filename="relatorio.pdf",
            document_id=999,
        )


@patch("core.tasks.document_tasks.DocumentPorts")
def test_upsert_pdf_document_raises_error_when_document_belongs_to_other_process(mock_ports):
    mock_ports.get_document_by_id.return_value = {
        "id": 10,
        "process_id": 999,
        "document_type_id": 3,
    }

    with pytest.raises(ValueError, match="does not match"):
        DocumentTasks.upsert_pdf_document(
            process_id=22,
            document_type_id=3,
            file_content=b"%PDF-1.4\ncontent",
            original_filename="relatorio.pdf",
            document_id=10,
        )

