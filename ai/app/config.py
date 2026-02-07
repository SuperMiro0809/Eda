from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Ollama
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "llama3:70b"

    # JWT
    jwt_secret: str = ""

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS
    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()