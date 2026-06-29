import pytest

from core.use_cases.document_use_cases import DocumentUseCases


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
    doc_type_id = 1

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



def test_add_comment_to_report_integration():
    process_id = 999
    doc_type_id = 888
    user_id = 1
    message_text = "Comentário de teste de integração"

    result = DocumentUseCases.add_comment_to_report(process_id, doc_type_id, message_text, user_id)
    
    assert result["document_id"] is not None
    assert result["message_id"] is not None

    details = DocumentUseCases.get_report_details(process_id, doc_type_id)
    
    assert details["document"] is not None
    assert len(details["messages"]) == 1
    assert details["messages"][0]["message"] == message_text
    assert "document_id" not in details["messages"][0]

def test_get_report_details_empty_integration():
    details = DocumentUseCases.get_report_details(process_id=0, document_type_id=0)
    
    assert details["document"] is None
    assert details["messages"] == []
    