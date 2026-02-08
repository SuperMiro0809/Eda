import os
from pathlib import Path
from typing import List

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredMarkdownLoader,
    Docx2txtLoader,
)
from langchain.schema import Document

from app.config import settings

# ----------------------------------------------------------------------


class DocumentLoader:
    """Load documents from various file formats."""

    SUPPORTED_EXTENSIONS = {
        ".pdf": PyPDFLoader,
        ".txt": TextLoader,
        ".md": UnstructuredMarkdownLoader,
        ".docx": Docx2txtLoader,
    }

    def __init__(self, documents_dir: str = None):
        self.documents_dir = Path(documents_dir or settings.documents_dir)

    def load_file(self, file_path: Path) -> List[Document]:
        """Load a single file and return documents."""
        ext = file_path.suffix.lower()

        if ext not in self.SUPPORTED_EXTENSIONS:
            raise ValueError(f"Unsupported file type: {ext}")

        loader_class = self.SUPPORTED_EXTENSIONS[ext]
        loader = loader_class(str(file_path))

        try:
            documents = loader.load()
            # Add source metadata
            for doc in documents:
                doc.metadata["source"] = file_path.name
                doc.metadata["file_path"] = str(file_path)
            return documents
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
            return []

    def load_directory(self) -> List[Document]:
        """Load all supported documents from the documents directory."""
        if not self.documents_dir.exists():
            print(f"Documents directory does not exist: {self.documents_dir}")
            return []

        all_documents = []

        for file_path in self.documents_dir.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in self.SUPPORTED_EXTENSIONS:
                print(f"Loading: {file_path.name}")
                docs = self.load_file(file_path)
                all_documents.extend(docs)
                print(f"  -> Loaded {len(docs)} document(s)")

        print(f"\nTotal documents loaded: {len(all_documents)}")
        return all_documents

    def get_supported_files(self) -> List[Path]:
        """List all supported files in the documents directory."""
        if not self.documents_dir.exists():
            return []

        return [
            f for f in self.documents_dir.iterdir()
            if f.is_file() and f.suffix.lower() in self.SUPPORTED_EXTENSIONS
        ]
