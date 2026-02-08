from pathlib import Path

from pydantic_settings import BaseSettings

# ----------------------------------------------------------------------

# Base directory for data files
BASE_DIR = Path(__file__).parent.parent


class Settings(BaseSettings):
    # Ollama
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "qwen2.5:7b"  # Fast multilingual model with good Bulgarian support
    embedding_model: str = "nomic-embed-text"

    # JWT
    jwt_secret: str = ""

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS
    frontend_url: str = "http://localhost:3000"

    # RAG - ChromaDB
    chroma_persist_dir: str = str(BASE_DIR / "data" / "chroma_db")
    chroma_collection_name: str = "eda_knowledge_base"

    # RAG - Document processing
    documents_dir: str = str(BASE_DIR / "data" / "documents")
    chunk_size: int = 1000
    chunk_overlap: int = 200

    # RAG - Retrieval
    top_k_results: int = 8
    similarity_threshold: float = 0.3  # No filtering - let the LLM use all retrieved context

    class Config:
        env_file = ".env"


settings = Settings()