from typing import List

from langchain.schema import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import settings

# ----------------------------------------------------------------------


class TextChunker:
    """Split documents into smaller chunks for embedding."""

    def __init__(
        self,
        chunk_size: int = None,
        chunk_overlap: int = None,
    ):
        self.chunk_size = chunk_size or settings.chunk_size
        self.chunk_overlap = chunk_overlap or settings.chunk_overlap

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

    def split_documents(self, documents: List[Document]) -> List[Document]:
        """Split documents into chunks while preserving metadata."""
        chunks = self.splitter.split_documents(documents)

        # Add chunk index to metadata
        for i, chunk in enumerate(chunks):
            chunk.metadata["chunk_index"] = i

        print(f"Split {len(documents)} documents into {len(chunks)} chunks")
        return chunks

    def split_text(self, text: str, metadata: dict = None) -> List[Document]:
        """Split raw text into chunks."""
        chunks = self.splitter.create_documents(
            texts=[text],
            metadatas=[metadata or {}],
        )
        return chunks
