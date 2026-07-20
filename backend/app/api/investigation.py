from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Request
import os
from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.dependencies import get_current_user

from app.services.investigation_service import InvestigationService
from app.services.report_service import ReportService
from app.services.dashboard_service import DashboardService
from app.services.pdf_service import PDFService


router = APIRouter(
    prefix="/investigation",
    tags=["Investigation"]
)


# -----------------------------
# Upload Image
# -----------------------------
@router.post("/upload")
def upload_image(
    request: Request,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    investigation = InvestigationService.upload_image(
        db=db,
        user_id=current_user["user_id"],
        image=image
    )

    explanation_url = None

    if investigation.explanation_path:

        filename = (
            investigation.explanation_path
            .replace("\\", "/")
            .split("app/uploads/")[-1]
        )

        explanation_url = (
            str(request.base_url)
            + "uploads/"
            + filename
        )

    return {

        "message": "Image uploaded successfully",

        "investigation": {

            "id": investigation.id,

            "prediction": investigation.prediction,

            "confidence": investigation.confidence,

            "status": investigation.status,

            "explanation_url": explanation_url

        }

    }


# -----------------------------
# History
# -----------------------------
@router.get("/history")
def history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return InvestigationService.get_history(
        db=db,
        user_id=current_user["user_id"]
    )


# -----------------------------
# Dashboard
# -----------------------------
@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return DashboardService.get_dashboard(
        db=db,
        user_id=current_user["user_id"]
    )


# -----------------------------
# Single Investigation
# -----------------------------
@router.get("/{investigation_id}")
def get_investigation(
    investigation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    investigation = InvestigationService.get_investigation(
        db=db,
        investigation_id=investigation_id
    )

    if not investigation:

        raise HTTPException(
            status_code=404,
            detail="Investigation not found"
        )

    return investigation


# -----------------------------
# Generate Report
# -----------------------------
@router.get("/{investigation_id}/report")
def generate_report(
    investigation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    investigation = InvestigationService.get_investigation(
        db=db,
        investigation_id=investigation_id
    )


    if not investigation:

        raise HTTPException(
            status_code=404,
            detail="Investigation not found"
        )



    report = ReportService.generate_report(
        prediction=investigation.prediction,
        confidence=investigation.confidence
    )


    return {

        "id": investigation.id,

        "prediction": report["prediction"],

        "confidence": report["confidence"],

        "risk_level": report["risk_level"],

        "summary": report["summary"],

        "findings": report["findings"],

        "status": investigation.status

    }

# -----------------------------
# Delete Investigation
# -----------------------------
@router.delete("/{investigation_id}")
def delete_investigation(
    investigation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    investigation = InvestigationService.delete_investigation(
        db=db,
        investigation_id=investigation_id
    )

    if not investigation:

        raise HTTPException(
            status_code=404,
            detail="Investigation not found"
        )

    return {
        "message": "Investigation deleted successfully"
    }



@router.get("/{investigation_id}/pdf")
def get_pdf(
    investigation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    investigation = InvestigationService.get_investigation(
        db=db,
        investigation_id=investigation_id
    )

    if not investigation:

        raise HTTPException(
            status_code=404,
            detail="Investigation not found"
        )

    # Generate PDF
    try:
        pdf_path = PDFService.generate_pdf(investigation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")

    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=500, detail="PDF not found after generation")

    filename = os.path.basename(pdf_path)
    return FileResponse(path=pdf_path, media_type="application/pdf", filename=filename)