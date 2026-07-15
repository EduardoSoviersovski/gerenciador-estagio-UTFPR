import pytest

from adapters.database.mysql_adapter import MySQLAdapter
from core.exceptions.document_exceptions import DocumentTemplateDoesNotExistError
from core.repo.document_repo import DELETE_DOCUMENT_TEMPLATE
from core.schemas.document_schemas import DocumentStatus, DocumentType
from core.schemas.role_schemas import UserRole
from core.use_cases.document_use_cases import DocumentUseCases
from core.use_cases.process_use_cases import ProcessUseCases
from core.tasks.document_tasks import DocumentTasks

def _delete_document_template(document_type_id: int, mime_type: str):
    adapter = MySQLAdapter()
    adapter.execute_query(DELETE_DOCUMENT_TEMPLATE, (document_type_id, mime_type))

def _assert_template_saved_correctly(document_type_id: int, expected_name: str, expected_template_type: str):
    templates = DocumentUseCases.get_all_document_templates()
    saved_template = next((t for t in templates if t["document_type_id"] == document_type_id), None)

    assert saved_template is not None, f"Template for type {document_type_id} not found."
    assert saved_template["file_name"] == expected_name
    assert saved_template["template_type"] == expected_template_type


@pytest.mark.parametrize(
    "perform_initial_insert, file_bytes, file_name, template_type",
    [
        (False, b"content_term_v1", "term_v1.pdf", "DOCUMENT"),
        (True, b"new_content", "report_v2.pdf", "REPORT")
    ],
    ids=["insert_flow", "update_flow"]
)
def test_document_template_save_flow_integration(perform_initial_insert, file_bytes, file_name, template_type):
    doc_type_id = DocumentType.OTHERS.value

    if perform_initial_insert:
        DocumentUseCases.save_document_template(
            file_bytes=b"content_term_v1",
            document_type_id=doc_type_id,
            file_name="term_v1.pdf",
            mime_type="application/pdf",
            template_type="DOCUMENT"
        )

    DocumentUseCases.save_document_template(
        file_bytes=file_bytes,
        document_type_id=doc_type_id,
        file_name=file_name,
        mime_type="application/pdf",
        template_type=template_type
    )

    _assert_template_saved_correctly(doc_type_id, file_name, template_type)


@pytest.mark.parametrize(
    "template_type_filter, expected_contained_ids, expected_type",
    [
        ("REPORT", [3], "REPORT"),
        ("DOCUMENT", [2], "DOCUMENT"),
        (None, [2, 3], None)
    ],
    ids=["reports_only", "standard_documents_only", "all_templates"]
)
def test_get_document_templates_filtering_integration(template_type_filter, expected_contained_ids, expected_type):
    DocumentUseCases.save_document_template(
        b"doc", document_type_id=2, file_name="standard.pdf", mime_type="application/pdf", template_type="DOCUMENT"
    )
    DocumentUseCases.save_document_template(
        b"rep", document_type_id=3, file_name="report.pdf", mime_type="application/pdf", template_type="REPORT"
    )

    results = DocumentUseCases.get_all_document_templates(template_type=template_type_filter)

    if expected_type is not None:
        assert all(t["template_type"] == expected_type for t in results), \
            f"All returned items should have template_type={expected_type}"

    returned_ids = [t["document_type_id"] for t in results]
    for expected_id in expected_contained_ids:
        assert expected_id in returned_ids, \
            f"The document_type_id {expected_id} should be present in the results list."


def test_add_comment_to_report_integration(create_mock_process_request):
    mock_request = create_mock_process_request(student_ra="7654321")
    
    created_process = ProcessUseCases.create_new_process(mock_request)
    process_id = created_process["id"]
    
    doc_type_id = 1 
    user_id = 1
    message_text = "Comentário de teste de integração"
    user_role = UserRole.ADMIN.value

    result = DocumentUseCases.add_comment_to_report(process_id, doc_type_id, message_text, user_id, user_role)
    
    assert result["document_id"] is not None
    assert result["message_id"] is not None

    details = DocumentUseCases.get_report_message_list(result["document_id"])
    
    assert details["document"] is not None
    assert len(details["messages"]) == 1
    assert details["messages"][0]["message"] == message_text
    assert "document_id" in details["messages"][0]

def test_get_report_details_empty_integration():
    details = DocumentUseCases.get_report_message_list(document_id=9999)
    
    assert details["document"] is None
    assert details["messages"] == []
    
def test_create_empty_document_integration(create_mock_process_request):
    mock_request = create_mock_process_request(student_ra="7654322")
    
    created_process = ProcessUseCases.create_new_process(mock_request)
    process_id = created_process["id"]
    
    doc_type_id = 3
    status_id = 1  
    
    document_id = DocumentTasks.create_empty_document(process_id, doc_type_id, status_id)
    
    assert document_id is not None
    
    doc = DocumentTasks.get_document(document_id)
    
    assert doc is not None
    assert doc["file_name"] == "Pendente_de_envio"
    assert doc["mime_type"] == "none"
    assert doc["file_content"] is None

def test_update_report_status_integration(create_mock_process_request):
    mock_request = create_mock_process_request(student_ra="1122334")
    
    created_process = ProcessUseCases.create_new_process(mock_request)
    process_id = created_process["id"]
    
    doc_type_id = 1 
    new_status_id = DocumentStatus.APPROVED.value 
    user_role = UserRole.ADVISOR.value

    result = DocumentUseCases.update_report_status(
        process_id=process_id, 
        document_type_id=doc_type_id, 
        status_id=new_status_id,
        user_role=user_role
    )
    
    assert result["document_id"] is not None
    assert result["status_id"] == new_status_id
    assert result["message"] == "Status updated successfully"

    details = DocumentUseCases.get_report_message_list(result["document_id"])
    
    assert details["document"] is not None
    assert details["document"]["status_id"] == new_status_id

def test_save_and_retrieve_multiple_formats_per_document_type():
    doc_type_id = DocumentType.OTHERS.value

    DocumentUseCases.save_document_template(
        file_bytes=b"fake_docx_content",
        document_type_id=doc_type_id,
        file_name="template.docx",
        mime_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        template_type="DOCUMENT"
    )

    DocumentUseCases.save_document_template(
        file_bytes=b"fake_pdf_content",
        document_type_id=doc_type_id,
        file_name="template.pdf",
        mime_type="application/pdf",
        template_type="DOCUMENT"
    )

    all_templates = DocumentUseCases.get_all_document_templates()
    saved_templates = [t for t in all_templates if t["document_type_id"] == doc_type_id]

    assert len(saved_templates) == 2, f"Expected 2 templates for type {doc_type_id}, found {len(saved_templates)}."

    file_names = {t["file_name"] for t in saved_templates}
    assert "template.docx" in file_names
    assert "template.pdf" in file_names

    mime_types = {t["mime_type"] for t in saved_templates}
    assert "application/vnd.openxmlformats-officedocument.wordprocessingml.document" in mime_types
    assert "application/pdf" in mime_types
    _delete_document_template(doc_type_id, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    _delete_document_template(doc_type_id, "application/pdf")

def test_get_template_for_existing_document_type_without_uploaded_template_integration():
    existing_doc_type_id_without_template = DocumentType.OTHERS.value

    with pytest.raises(DocumentTemplateDoesNotExistError):
        DocumentUseCases.get_document_template_by_type_id(existing_doc_type_id_without_template)
