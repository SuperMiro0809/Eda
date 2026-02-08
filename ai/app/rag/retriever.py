from typing import List, Optional

from app.config import settings
from .vectorstore import VectorStore

# ----------------------------------------------------------------------


class Retriever:
    """Retrieve relevant context from the vector store."""

    def __init__(
        self,
        vectorstore: VectorStore = None,
        top_k: int = None,
        similarity_threshold: float = None,
    ):
        self.vectorstore = vectorstore or VectorStore()
        self.top_k = top_k or settings.top_k_results
        self.similarity_threshold = similarity_threshold or settings.similarity_threshold

    def retrieve(self, query: str, top_k: int = None) -> List[dict]:
        """Retrieve relevant documents for a query."""
        top_k = top_k or self.top_k

        results = self.vectorstore.search(query, top_k=top_k)

        print(f"[RAG] Query: {query[:50]}...")
        print(f"[RAG] Found {len(results)} results before filtering")
        for r in results:
            print(f"[RAG]   - Score: {r.get('score', 'N/A')}, Source: {r.get('metadata', {}).get('source', 'N/A')}")

        # Filter by similarity threshold (lowered for better recall)
        filtered_results = [
            r for r in results
            if r.get("score", 0) >= self.similarity_threshold
        ]

        print(f"[RAG] {len(filtered_results)} results after filtering (threshold: {self.similarity_threshold})")

        return filtered_results

    def get_context(self, query: str, top_k: int = None) -> str:
        """Get formatted context string for the LLM prompt."""
        results = self.retrieve(query, top_k=top_k)

        if not results:
            print("[RAG] No context found - using general knowledge")
            return ""

        context_parts = []
        for i, result in enumerate(results, 1):
            source = result["metadata"].get("source", "Unknown")
            content = result["content"]
            context_parts.append(f"[Source {i}: {source}]\n{content}")

        return "\n\n---\n\n".join(context_parts)

    def get_context_with_sources(self, query: str, top_k: int = None) -> dict:
        """Get context and source information for citations."""
        results = self.retrieve(query, top_k=top_k)

        if not results:
            return {"context": "", "sources": []}

        context_parts = []
        sources = []

        for i, result in enumerate(results, 1):
            source = result["metadata"].get("source", "Unknown")
            content = result["content"]
            score = result.get("score", 0)

            context_parts.append(f"[Source {i}: {source}]\n{content}")
            sources.append({
                "index": i,
                "source": source,
                "score": score,
            })

        return {
            "context": "\n\n---\n\n".join(context_parts),
            "sources": sources,
        }
