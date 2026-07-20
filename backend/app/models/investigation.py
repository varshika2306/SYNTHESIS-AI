from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Investigation(Base):

    __tablename__ = "investigations"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )


    image_path = Column(
        String,
        nullable=False
    )


    prediction = Column(
        String,
        nullable=False
    )


    confidence = Column(
        Float,
        nullable=False
    )


    # NEW: Grad-CAM output
    explanation_path = Column(
        String,
        nullable=True
    )


    status = Column(
        String,
        default="Completed"
    )


    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


    user = relationship(
        "User",
        back_populates="investigations"
    )