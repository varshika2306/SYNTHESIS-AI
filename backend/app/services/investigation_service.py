import os
import shutil
import traceback
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

    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

    @staticmethod
    def upload_image(
        db: Session,
        user_id: int,
        image: UploadFile
    ):

        try:

            print("========== STEP 1 : Validation ==========")

            extension = os.path.splitext(
                image.filename
            )[1].lower()

            if extension not in InvestigationService.ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=400,
                    detail="Only JPG, JPEG and PNG images are allowed."
                )

            print("Extension:", extension)

            print("========== STEP 2 : File Size ==========")

            image.file.seek(0, 2)
            file_size = image.file.tell()
            image.file.seek(0)

            print("File Size:", file_size)

            if file_size > InvestigationService.MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail="Image size exceeds 10 MB."
                )

            print("========== STEP 3 : Saving Image ==========")

            filename = f"{uuid.uuid4()}{extension}"

            image_path = os.path.join(
                UPLOAD_DIR,
                filename
            )

            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(
                    image.file,
                    buffer
                )

            print("Saved:", image_path)

            print("========== STEP 4 : Running Prediction ==========")

            result = predictor.predict(
                image_path
            )

            print(result)

            print("========== STEP 5 : Saving Database ==========")

            investigation = InvestigationRepository.create(

                db=db,

                user_id=user_id,

                image_path=image_path,

                prediction=result["prediction"],

                confidence=result["confidence"],

                explanation_path=result["heatmap"],

                status="Completed"
            )

            print("========== STEP 6 : SUCCESS ==========")

            return investigation

        except Exception:

            print("========== ERROR ==========")

            traceback.print_exc()

            raise

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