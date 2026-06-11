from unittest.mock import patch
from core.tasks.document_tasks import DocumentTasks


@patch("core.tasks.document_tasks.DocumentPorts")
def test_save_document_template_insert_flow(mock_ports):
    mock_ports.get_template_by_type_id.return_value = None

    file_content = b"fake_pdf_bytes"

    DocumentTasks.save_document_template(
        document_type_id=1,
        file_content=file_content,
        file_name="termo.pdf",
        mime_type="application/pdf",
        is_report=False
    )

    mock_ports.save_document_template.assert_called_once_with(
        document_type_id=1,
        file_content=file_content,
        file_name="termo.pdf",
        file_size=len(file_content),
        mime_type="application/pdf",
        is_report=False
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
        is_report=True
    )

    mock_ports.update_document_template.assert_called_once_with(
        document_type_id=2,
        file_content=new_content,
        file_name="relatorio_parcial.pdf",
        file_size=len(new_content),
        mime_type="application/pdf",
        is_report=True
    )


@patch("core.tasks.document_tasks.DocumentPorts")
def test_get_all_document_templates_with_report_flag(mock_ports):
    DocumentTasks.get_all_document_templates(is_report=True)

    mock_ports.get_all_document_templates.assert_called_once_with(True)