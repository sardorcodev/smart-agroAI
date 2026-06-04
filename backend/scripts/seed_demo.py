from dataclasses import dataclass
import os

from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.database import SessionLocal
from backend.app.models import UserDB
from backend.app.security import get_password_hash


DEFAULT_DEMO_PASSWORD = "demo-password-123"
DEFAULT_FARMER_EMAIL = "demo.farmer@example.com"
DEFAULT_FARMER_NAME = "Demo Farmer"


@dataclass(frozen=True)
class SeedResult:
    email: str
    role: str
    action: str


def normalize_email(email: str) -> str:
    return email.strip().lower()


def seed_user(db: Session, *, fullname: str, email: str, password: str, role: str) -> SeedResult:
    normalized_email = normalize_email(email)
    existing_user = db.query(UserDB).filter(UserDB.email == normalized_email).first()

    if existing_user:
        return SeedResult(email=normalized_email, role=existing_user.role, action="skipped")

    db.add(
        UserDB(
            fullname=fullname.strip(),
            email=normalized_email,
            password_hash=get_password_hash(password),
            role=role,
        )
    )
    db.commit()
    return SeedResult(email=normalized_email, role=role, action="created")


def seed_demo_users(
    db: Session,
    *,
    password: str,
    farmer_email: str = DEFAULT_FARMER_EMAIL,
    farmer_name: str = DEFAULT_FARMER_NAME,
    admin_email: str = "",
    allowed_admin_emails: set[str] | frozenset[str] | None = None,
) -> list[SeedResult]:
    results = [
        seed_user(
            db,
            fullname=farmer_name,
            email=farmer_email,
            password=password,
            role="fermer",
        )
    ]

    normalized_admin_email = normalize_email(admin_email) if admin_email else ""
    allowed_admins = allowed_admin_emails or set()
    if normalized_admin_email:
        if normalized_admin_email in allowed_admins:
            results.append(
                seed_user(
                    db,
                    fullname="Demo Admin",
                    email=normalized_admin_email,
                    password=password,
                    role="admin",
                )
            )
        else:
            results.append(SeedResult(email=normalized_admin_email, role="admin", action="skipped-not-allowed"))

    return results


def format_seed_summary(results: list[SeedResult], *, used_default_password: bool) -> str:
    lines = ["Demo seed summary:"]
    if used_default_password:
        lines.append("WARNING: using the local-only default demo password. Override DEMO_SEED_PASSWORD for shared environments.")

    for result in results:
        lines.append(f"- {result.action}: {result.email} ({result.role})")

    return "\n".join(lines)


def main() -> None:
    password = os.getenv("DEMO_SEED_PASSWORD", DEFAULT_DEMO_PASSWORD)
    farmer_email = os.getenv("DEMO_FARMER_EMAIL", DEFAULT_FARMER_EMAIL)
    farmer_name = os.getenv("DEMO_FARMER_NAME", DEFAULT_FARMER_NAME)
    admin_email = os.getenv("DEMO_ADMIN_EMAIL", "")

    db = SessionLocal()
    try:
        results = seed_demo_users(
            db,
            password=password,
            farmer_email=farmer_email,
            farmer_name=farmer_name,
            admin_email=admin_email,
            allowed_admin_emails=settings.admin_emails,
        )
    finally:
        db.close()

    print(format_seed_summary(results, used_default_password=password == DEFAULT_DEMO_PASSWORD))


if __name__ == "__main__":
    main()
