from datetime import date

from pydantic import BaseModel, Field, field_validator, model_validator

from .config import EMAIL_PATTERN, MAX_ANALYSIS_DATE_RANGE_DAYS


class RegisterReq(BaseModel):
    fullname: str = Field(min_length=1, max_length=120)
    email: str
    password: str = Field(min_length=8, max_length=128)
    role: str = "fermer"

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if not EMAIL_PATTERN.match(normalized):
            raise ValueError("Invalid email format")
        return normalized


class LoginReq(BaseModel):
    email: str
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if not EMAIL_PATTERN.match(normalized):
            raise ValueError("Invalid email format")
        return normalized


class UserPublic(BaseModel):
    id: int
    fullname: str | None = None
    email: str
    role: str


class TokenResponse(BaseModel):
    status: str = "success"
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class MeResponse(BaseModel):
    status: str = "success"
    user: UserPublic


class FarmData(BaseModel):
    n: float = Field(ge=0, le=500)
    p: float = Field(ge=0, le=500)
    k: float = Field(ge=0, le=500)
    ph: float = Field(ge=0, le=14)
    lat: float = Field(ge=-90, le=90)
    lon: float = Field(ge=-180, le=180)
    current_soil_moisture: float = Field(ge=0, le=100)
    area_m2: float = Field(default=10.0, gt=0, le=10_000_000)
    start_date: date
    end_date: date

    @model_validator(mode="after")
    def validate_date_range(self):
        if self.start_date > self.end_date:
            raise ValueError("start_date must be on or before end_date")

        if (self.end_date - self.start_date).days > MAX_ANALYSIS_DATE_RANGE_DAYS:
            raise ValueError(f"date range must not exceed {MAX_ANALYSIS_DATE_RANGE_DAYS} days")

        return self
