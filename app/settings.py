from app.utils.filesystem import get_project_root
from pydantic_settings import BaseSettings, SettingsConfigDict, PydanticBaseSettingsSource, YamlConfigSettingsSource
# from app.models.config import DBConfig, ThrottlingConfig
# from app.models.prompt import PromptsConfig

class Settings(BaseSettings):
    debug: bool = True
    GOOGLE_API_KEY: str
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