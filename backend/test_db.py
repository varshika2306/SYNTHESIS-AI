from app.database.database import engine, Base

from app.models.user import User
from app.models.investigation import Investigation

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Done!")