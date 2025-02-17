import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from pathlib import Path

# ✅ Load environment variables from .env
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# ✅ Retrieve DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is not set. Check your .env file!")

# ✅ Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=True)  # Debugging enabled, remove `echo=True` in production

# ✅ Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Create Base class
Base = declarative_base()

# ✅ Dependency: Get Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
