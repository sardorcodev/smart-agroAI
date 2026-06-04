from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.database import Base
from backend.app.models import UserDB
from backend.app.security import verify_password
from backend.scripts.seed_demo import format_seed_summary, seed_demo_users


def create_test_session(tmp_path):
    engine = create_engine(f"sqlite:///{(tmp_path / 'seed_test.db').as_posix()}")
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return TestingSession()


def test_seed_demo_users_is_idempotent(tmp_path):
    db = create_test_session(tmp_path)
    try:
        first_results = seed_demo_users(db, password="safe-demo-password")
        second_results = seed_demo_users(db, password="safe-demo-password")

        users = db.query(UserDB).all()
        assert len(users) == 1
        assert first_results[0].action == "created"
        assert second_results[0].action == "skipped"
        assert users[0].email == "demo.farmer@example.com"
        assert users[0].role == "fermer"
        assert verify_password("safe-demo-password", users[0].password_hash)
    finally:
        db.close()


def test_seed_demo_admin_requires_allowed_email(tmp_path):
    db = create_test_session(tmp_path)
    try:
        results = seed_demo_users(
            db,
            password="safe-demo-password",
            admin_email="demo.admin@example.com",
            allowed_admin_emails=set(),
        )

        assert [result.action for result in results] == ["created", "skipped-not-allowed"]
        assert db.query(UserDB).filter(UserDB.role == "admin").count() == 0
    finally:
        db.close()


def test_seed_demo_admin_can_be_created_when_allowed(tmp_path):
    db = create_test_session(tmp_path)
    try:
        results = seed_demo_users(
            db,
            password="safe-demo-password",
            admin_email="demo.admin@example.com",
            allowed_admin_emails={"demo.admin@example.com"},
        )

        assert [result.action for result in results] == ["created", "created"]
        assert db.query(UserDB).filter(UserDB.role == "admin").count() == 1
    finally:
        db.close()


def test_seed_summary_does_not_print_password_or_hash(tmp_path):
    db = create_test_session(tmp_path)
    try:
        password = "safe-demo-password"
        results = seed_demo_users(db, password=password)
        summary = format_seed_summary(results, used_default_password=False)

        assert "demo.farmer@example.com" in summary
        assert password not in summary
        assert "password_hash" not in summary
        assert "$2b$" not in summary
    finally:
        db.close()
