from typing import List

import httpx

from app.config import settings

# ----------------------------------------------------------------------


class EmbeddingGenerator:
    """Generate embeddings using Ollama."""

    def __init__(
        self,
        model: str = None,
        base_url: str = None,
    ):
        self.model = model or settings.embedding_model
        self.base_url = base_url or settings.ollama_host

    async def embed_text(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/embeddings",
                json={
                    "model": self.model,
                    "prompt": text,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            return response.json()["embedding"]

    async def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        embeddings = []
        for i, text in enumerate(texts):
            if i % 10 == 0:
                print(f"Embedding {i + 1}/{len(texts)}...")
            embedding = await self.embed_text(text)
            embeddings.append(embedding)
        return embeddings

    def embed_text_sync(self, text: str) -> List[float]:
        """Synchronous version for embedding a single text."""
        with httpx.Client() as client:
            response = client.post(
                f"{self.base_url}/api/embeddings",
                json={
                    "model": self.model,
                    "prompt": text,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            return response.json()["embedding"]

    def embed_texts_sync(self, texts: List[str]) -> List[List[float]]:
        """Synchronous version for embedding multiple texts."""
        embeddings = []
        for i, text in enumerate(texts):
            if i % 10 == 0:
                print(f"Embedding {i + 1}/{len(texts)}...")
            embedding = self.embed_text_sync(text)
            embeddings.append(embedding)
        return embeddings


class OllamaEmbeddingFunction:
    """ChromaDB-compatible embedding function using Ollama."""

    def __init__(self, model: str = None, base_url: str = None):
        self._model = model or settings.embedding_model
        self.generator = EmbeddingGenerator(model=self._model, base_url=base_url)

    def __call__(self, input: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts (ChromaDB interface)."""
        return self.generator.embed_texts_sync(input)

    def embed_documents(self, documents: List[str]) -> List[List[float]]:
        """Embed documents (ChromaDB interface)."""
        return self.generator.embed_texts_sync(documents)

    def embed_query(self, input) -> List[List[float]]:
        """Embed a single query (ChromaDB interface)."""
        # ChromaDB may pass a list with single item or a string
        if isinstance(input, list):
            return self.generator.embed_texts_sync(input)
        else:
            return [self.generator.embed_text_sync(input)]

    def name(self) -> str:
        """Return the name of the embedding function (required by ChromaDB)."""
        return f"ollama_{self._model}"
