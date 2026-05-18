from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://orto_user:orto_secret@localhost:5432/orto_ia"
    REDIS_URL: str = "redis://localhost:6379/0"
    ANTHROPIC_API_KEY: str = ""
    WEBCEPH_API_KEY: str = ""
    WEBCEPH_API_URL: str = "https://api.webceph.com/v1"
    CEPHX_API_KEY: str = ""
    CEPHX_API_URL: str = "https://api.cephx.com/v2"
    JWT_SECRET: str = "dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 24
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    S3_BUCKET: str = "orto-ia-files"
    CLOUDFRONT_URL: str = ""
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
