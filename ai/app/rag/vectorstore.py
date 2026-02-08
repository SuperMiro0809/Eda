from typing import List, Optional
from pathlib import Path

import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain.schema import Document

from app.config import settings
from .embeddings import OllamaEmbeddingFunction

# ----------------------------------------------------------------------


class VectorStore:
    """ChromaDB vector store for document storage and retrieval."""

    def __init__(
        self,
        persist_dir: str = None,
        collection_name: str = None,
    ):
        self.persist_dir = persist_dir or settings.chroma_persist_dir
        self.collection_name = collection_name or settings.chroma_collection_name

        # Ensure persist directory exists
        Path(self.persist_dir).mkdir(parents=True, exist_ok=True)

        # Initialize ChromaDB client with persistence
        self.client = chromadb.PersistentClient(
            path=self.persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False),
        )

        # Initialize embedding function
        self.embedding_function = OllamaEmbeddingFunction()

        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            embedding_function=self.embedding_function,
            metadata={"hnsw:space": "cosine"},
        )

    def add_documents(self, documents: List[Document]) -> None:
        """Add documents to the vector store."""
        if not documents:
            print("No documents to add")
            return

        # Prepare data for ChromaDB
        ids = []
        texts = []
        metadatas = []

        for i, doc in enumerate(documents):
            # Create unique ID based on source and chunk index
            source = doc.metadata.get("source", "unknown")
            chunk_idx = doc.metadata.get("chunk_index", i)
            doc_id = f"{source}_{chunk_idx}"

            ids.append(doc_id)
            texts.append(doc.page_content)
            metadatas.append(doc.metadata)

        # Add to collection in batches
        batch_size = 50
        for i in range(0, len(ids), batch_size):
            batch_ids = ids[i:i + batch_size]
            batch_texts = texts[i:i + batch_size]
            batch_metadatas = metadatas[i:i + batch_size]

            print(f"Adding batch {i // batch_size + 1}/{(len(ids) - 1) // batch_size + 1}...")

            self.collection.add(
                ids=batch_ids,
                documents=batch_texts,
                metadatas=batch_metadatas,
            )

        print(f"Added {len(ids)} documents to collection '{self.collection_name}'")

    def search(
        self,
        query: str,
        top_k: int = None,
    ) -> List[dict]:
        """Search for similar documents."""
        top_k = top_k or settings.top_k_results

        results = self.collection.query(
            query_texts=[query],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

        # Format results
        formatted_results = []
        if results["documents"] and results["documents"][0]:
            for i in range(len(results["documents"][0])):
                formatted_results.append({
                    "content": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                    "distance": results["distances"][0][i] if results["distances"] else None,
                    "score": 1 - results["distances"][0][i] if results["distances"] else None,
                })

        return formatted_results

    def delete_collection(self) -> None:
        """Delete the entire collection."""
        self.client.delete_collection(self.collection_name)
        print(f"Deleted collection '{self.collection_name}'")

    def get_stats(self) -> dict:
        """Get collection statistics."""
        return {
            "collection_name": self.collection_name,
            "document_count": self.collection.count(),
            "persist_dir": self.persist_dir,
        }

    def list_documents(self) -> List[str]:
        """List all unique source documents in the collection."""
        results = self.collection.get(include=["metadatas"])
        sources = set()
        for metadata in results["metadatas"]:
            if "source" in metadata:
                sources.add(metadata["source"])
        return sorted(list(sources))
