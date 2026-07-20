from app.database.database import Base, engine

# Import models so SQLAlchemy knows the tables
from app.models.user import User
from app.models.investigation import Investigation


def init_db():

    print("Creating database tables...")

    Base.metadata.create_all(bind=engine)

    print("Database initialized successfully")


if __name__ == "__main__":
    init_db()