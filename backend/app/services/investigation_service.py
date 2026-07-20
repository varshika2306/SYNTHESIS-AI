import os
import shutil
import uuid

from fastapi import UploadFile
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.investigation_repository import InvestigationRepository
from app.ml.predictor import predictor


UPLOAD_DIR = "app/uploads/images"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


class InvestigationService:

    ALLOWED_EXTENSIONS = {
        ".jpg",
        ".jpeg",
        ".png"
    }

    MAX_FILE_SIZE = 10 * 1024 * 1024   # 10 MB

    @staticmethod
    def upload_image(
        db: Session,
        user_id: int,
        image: UploadFile
    ):

        # -------------------------
        # Validate Extension
        # -------------------------

        extension = os.path.splitext(
            image.filename
        )[1].lower()

        if extension not in InvestigationService.ALLOWED_EXTENSIONS:

            raise HTTPException(
                status_code=400,
                detail="Only JPG, JPEG and PNG images are allowed."
            )

        # -------------------------
        # Validate File Size
        # -------------------------

        image.file.seek(0, 2)
        file_size = image.file.tell()
        image.file.seek(0)

        if file_size > InvestigationService.MAX_FILE_SIZE:

            raise HTTPException(
                status_code=400,
                detail="Image size exceeds 10 MB."
            )

        # -------------------------
        # Unique Filename
        # -------------------------

        filename = f"{uuid.uuid4()}{extension}"

        image_path = os.path.join(
            UPLOAD_DIR,
            filename
        )

        # -------------------------
        # Save Image
        # -------------------------

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(
                image.file,
                buffer
            )

        # -------------------------
        # AI Prediction
        # -------------------------

        result = predictor.predict(
            image_path
        )

        prediction = result["prediction"]

        confidence = result["confidence"]

        explanation_path = result["heatmap"]

        # -------------------------
        # Save Investigation
        # -------------------------

        investigation = InvestigationRepository.create(

            db=db,

            user_id=user_id,

            image_path=image_path,

            prediction=prediction,

            confidence=confidence,

            explanation_path=explanation_path,

            status="Completed"
        )

        return investigation

    @staticmethod
    def get_history(
        db: Session,
        user_id: int
    ):

        return InvestigationRepository.get_all_by_user(
            db=db,
            user_id=user_id
        )

    @staticmethod
    def get_investigation(
        db: Session,
        investigation_id: int
    ):

        return InvestigationRepository.get_by_id(
            db=db,
            investigation_id=investigation_id
        )

    @staticmethod
    def delete_investigation(
        db: Session,
        investigation_id: int
    ):

        return InvestigationRepository.delete(
            db=db,
            investigation_id=investigation_id
        )