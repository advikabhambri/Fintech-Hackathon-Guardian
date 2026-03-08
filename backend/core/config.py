from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://wealth_user:wealth_pass@db:5432/wealth_wellness_db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Application
    DEBUG: bool = True
    API_PREFIX: str = "/api"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        
        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str):
            if field_name == 'CORS_ORIGINS':
                return json.loads(raw_val)
            return raw_val


settings = Settings()
