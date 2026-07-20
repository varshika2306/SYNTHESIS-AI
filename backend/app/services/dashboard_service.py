from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.investigation import Investigation


class DashboardService:

    @staticmethod
    def get_dashboard(
        db: Session,
        user_id: int
    ):

        investigations = (
            db.query(Investigation)
            .filter(
                Investigation.user_id == user_id
            )
            .all()
        )

        total = len(investigations)

        real = sum(
            1 for item in investigations
            if item.prediction == "REAL"
        )

        fake = sum(
            1 for item in investigations
            if item.prediction == "FAKE"
        )

        if total > 0:
            average_confidence = round(
                sum(
                    item.confidence
                    for item in investigations
                ) / total,
                2
            )
        else:
            average_confidence = 0

        return {
            "total": total,
            "real": real,
            "fake": fake,
            "average_confidence": average_confidence
        }