from app.utils.filesystem import get_project_root
from pydantic_settings import BaseSettings, SettingsConfigDict, PydanticBaseSettingsSource, YamlConfigSettingsSource
from typing import Literal

# from app.models.config import DBConfig, ThrottlingConfig
# from app.models.prompt import PromptsConfig

class Settings(BaseSettings):
    debug: bool = True
    GOOGLE_API_KEY: str
    GOOGLE_PARSING_MODEL: Literal["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-pro-preview-03-25"] = "gemini-2.0-flash-lite"
    GOOGLE_EMBEDDING_MODEL: Literal["gemini-embedding-exp-03-07"] = "gemini-embedding-exp-03-07"
    OPENAI_API_KEY: str | None = None
    OPENAI_EMBEDDING_MODEL: Literal["text-embedding-3-small", "text-embedding-3-large"] = "text-embedding-3-small"
    QDRANT_URL: str
    QDRANT_API_KEY: str
    QDRANT_COLLECTION_NAME: str = "REMOVED_BUCKET_NAME"
    # prompts: PromptsConfig
    # db_config: DBConfig
    # throttling_config: ThrottlingConfig

    model_config = SettingsConfigDict(
        env_file=get_project_root() / ".env",
        # yaml_file=[get_project_root() / "config.yaml", get_project_root() / "prompts.yaml"]
    )

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        return init_settings, env_settings, dotenv_settings, YamlConfigSettingsSource(settings_cls)


settings = Settings()