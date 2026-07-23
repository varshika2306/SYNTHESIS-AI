import os
import shutil
import traceback
import uuid

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.repositories.investigation_repository import InvestigationRepository
from app.ml.predictor import get_predictor


UPLOAD_DIR = "app/uploads/images"

os.makedirs(UPLOAD_DIR, exist_ok=True)


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

            print("\n========== STEP 1 : VALIDATION ==========")

            extension = os.path.splitext(image.filename)[1].lower()

            if extension not in InvestigationService.ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=400,
                    detail="Only JPG, JPEG and PNG are allowed."
                )

            image.file.seek(0, os.SEEK_END)
            file_size = image.file.tell()
            image.file.seek(0)

            print("Extension :", extension)
            print("Size      :", file_size)

            if file_size > InvestigationService.MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail="Image exceeds 10MB."
                )

            print("\n========== STEP 2 : SAVE IMAGE ==========")

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

            print("Saved to:", image_path)

            print("\n========== STEP 3 : LOAD MODEL ==========")

            predictor = get_predictor()

            print("Predictor loaded successfully")

            print("\n========== STEP 4 : RUN PREDICTION ==========")

            result = predictor.predict(image_path)

            print(result)

            print("\n========== STEP 5 : SAVE DATABASE ==========")

            investigation = InvestigationRepository.create(

                db=db,

                user_id=user_id,

                image_path=image_path,

                prediction=result["prediction"],

                confidence=result["confidence"],

                explanation_path=result["heatmap"],

                status="Completed"

            )

            print("\n========== SUCCESS ==========")

            return investigation

        except HTTPException:
            raise

        except Exception as e:

            print("\n========== ERROR ==========")
            print(type(e))
            print(e)

            traceback.print_exc()

            raise HTTPException(
                status_code=500,
                detail=str(e)
            )

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