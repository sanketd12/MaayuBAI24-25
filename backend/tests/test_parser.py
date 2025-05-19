import pytest
from pathlib import Path
import json
from src.parser import parse_pdf, parse_doc, generate_json
from src.data_models import UserInformation

@pytest.fixture
def sample_pdf_path(tmp_path):
    # Create a sample PDF file for testing
    pdf_path = tmp_path / "test.pdf"
    # Add some basic PDF content
    with open(pdf_path, 'wb') as f:
        f.write(b'%PDF-1.4\n%EOF')
    return str(pdf_path)

@pytest.fixture
def sample_docx_path(tmp_path):
    # Create a sample DOCX file for testing
    docx_path = tmp_path / "test.docx"
    from docx import Document
    doc = Document()
    doc.add_paragraph("Test content")
    doc.save(docx_path)
    return str(docx_path)

@pytest.fixture
def sample_json_path(tmp_path):
    return str(tmp_path / "output.json")

def test_parse_pdf(sample_pdf_path):
    content = parse_pdf(sample_pdf_path)
    assert isinstance(content, str)
    assert len(content) > 0

def test_parse_doc(sample_docx_path):
    content = parse_doc(sample_docx_path)
    assert isinstance(content, str)
    assert "Test content" in content

def test_generate_json(sample_json_path):
    test_content = """
    John Doe
    Education: B.S. Computer Science, University of Test
    Skills: Python, Java, SQL
    """
    
    generate_json(test_content, sample_json_path)
    
    # Verify JSON file was created
    assert Path(sample_json_path).exists()
    
    # Verify JSON content
    with open(sample_json_path, 'r') as f:
        data = json.load(f)
        assert "userDetails" in data
        assert "education" in data
        assert isinstance(data["userDetails"]["skills"], list) 