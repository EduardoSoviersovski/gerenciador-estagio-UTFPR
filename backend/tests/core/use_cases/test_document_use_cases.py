import pytest

from core.use_cases.document_use_cases import DocumentUseCases


def _assert_template_saved_correctly(document_type_id: int, expected_name: str, expected_is_report: bool):
    templates = DocumentUseCases.get_all_document_templates()
    saved_template = next((t for t in templates if t["document_type_id"] == document_type_id), None)

    assert saved_template is not None, f"Template for type {document_type_id} not found."
    assert saved_template["file_name"] == expected_name
    assert saved_template["is_report"] == expected_is_report



@pytest.mark.parametrize(
    "perform_initial_insert, file_bytes, file_name, is_report",
    [
        (False, b"content_term_v1", "term_v1.pdf", False),
        (True, b"new_content", "report_v2.pdf", True)
    ],
    ids=["insert_flow", "update_flow"]
)
def test_document_template_save_flow_integration(perform_initial_insert, file_bytes, file_name, is_report):
    doc_type_id = 1

    if perform_initial_insert:
        DocumentUseCases.save_document_template(
            file_bytes=b"content_term_v1",
            document_type_id=doc_type_id,
            file_name="term_v1.pdf",
            mime_type="application/pdf",
            is_report=False
        )

    DocumentUseCases.save_document_template(
        file_bytes=file_bytes,
        document_type_id=doc_type_id,
        file_name=file_name,
        mime_type="application/pdf",
        is_report=is_report
    )

    _assert_template_saved_correctly(doc_type_id, file_name, is_report)


@pytest.mark.parametrize(
    "is_report_filter, expected_contained_ids, expected_flag",
    [
        (True, [3], True),
        (False, [2], False),
        (None, [2, 3], None)
    ],
    ids=["reports_only", "standard_documents_only", "all_templates"]
)
def test_get_document_templates_filtering_integration(is_report_filter, expected_contained_ids, expected_flag):
    DocumentUseCases.save_document_template(
        b"doc", document_type_id=2, file_name="standard.pdf", mime_type="application/pdf", is_report=False
    )
    DocumentUseCases.save_document_template(
        b"rep", document_type_id=3, file_name="report.pdf", mime_type="application/pdf", is_report=True
    )

    results = DocumentUseCases.get_all_document_templates(is_report=is_report_filter)

    if expected_flag is not None:
        assert all(bool(t["is_report"]) == expected_flag for t in results), \
            f"All returned items should have is_report={expected_flag}"

    returned_ids = [t["document_type_id"] for t in results]
    for expected_id in expected_contained_ids:
        assert expected_id in returned_ids, \
            f"The document_type_id {expected_id} should be present in the results list."
