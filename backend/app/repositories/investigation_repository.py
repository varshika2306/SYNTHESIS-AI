from sqlalchemy.orm import Session

from app.models.investigation import Investigation


class InvestigationRepository:


    @staticmethod
    def create(
        db: Session,
        user_id: int,
        image_path: str,
        prediction: str,
        confidence: float,
        explanation_path: str = None,
        status: str = "Completed"
    ):

        investigation = Investigation(

            user_id=user_id,

            image_path=image_path,

            prediction=prediction,

            confidence=confidence,

            explanation_path=explanation_path,

            status=status
        )


        db.add(investigation)

        db.commit()

        db.refresh(investigation)


        return investigation



    @staticmethod
    def get_by_id(
        db: Session,
        investigation_id: int
    ):

        return (
            db.query(Investigation)
            .filter(
                Investigation.id == investigation_id
            )
            .first()
        )



    @staticmethod
    def get_all_by_user(
        db: Session,
        user_id: int
    ):

        return (
            db.query(Investigation)
            .filter(
                Investigation.user_id == user_id
            )
            .order_by(
                Investigation.created_at.desc()
            )
            .all()
        )



    @staticmethod
    def delete(
        db: Session,
        investigation_id: int
    ):

        investigation = (
            db.query(Investigation)
            .filter(
                Investigation.id == investigation_id
            )
            .first()
        )


        if investigation:

            db.delete(
                investigation
            )

            db.commit()


        return investigation



    @staticmethod
    def count_by_user(
        db: Session,
        user_id: int
    ):

        return (
            db.query(Investigation)
            .filter(
                Investigation.user_id == user_id
            )
            .count()
        )