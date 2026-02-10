from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base

from core.config import settings

engine = create_engine(settings.DATABASE_URL,future=True)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)
Base=declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
