"""
PDF generation service for TruthLens AI
"""

import os
from datetime import datetime

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

from app.services.report_service import ReportService


REPORTS_DIR = "app/reports"
os.makedirs(REPORTS_DIR, exist_ok=True)


class PDFService:

    @staticmethod
    def generate_pdf(investigation):

        report = ReportService.generate_report(
            prediction=investigation.prediction,
            confidence=investigation.confidence
        )

        filename = (
            f"investigation_{investigation.id}_"
            f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        )

        pdf_path = os.path.join(
            REPORTS_DIR,
            filename
        )

        c = canvas.Canvas(
            pdf_path,
            pagesize=letter
        )

        width, height = letter

        y = height - 60

        c.setFont("Helvetica-Bold", 18)
        c.drawString(
            50,
            y,
            "TruthLens AI Investigation Report"
        )

        y -= 40

        c.setFont("Helvetica", 12)

        c.drawString(
            50,
            y,
            f"Investigation ID : {investigation.id}"
        )

        y -= 20

        c.drawString(
            50,
            y,
            f"Prediction : {report['prediction']}"
        )

        y -= 20

        c.drawString(
            50,
            y,
            f"Confidence : {report['confidence']}%"
        )

        y -= 20

        c.drawString(
            50,
            y,
            f"Risk Level : {report['risk_level']}"
        )

        y -= 20

        c.drawString(
            50,
            y,
            f"Status : {investigation.status}"
        )

        y -= 20

        c.drawString(
            50,
            y,
            f"Created : {investigation.created_at}"
        )

        y -= 35

        c.setFont(
            "Helvetica-Bold",
            14
        )

        c.drawString(
            50,
            y,
            "Summary"
        )

        y -= 20

        c.setFont(
            "Helvetica",
            12
        )

        c.drawString(
            50,
            y,
            report["summary"]
        )

        y -= 35

        c.setFont(
            "Helvetica-Bold",
            14
        )

        c.drawString(
            50,
            y,
            "Findings"
        )

        y -= 20

        c.setFont(
            "Helvetica",
            12
        )

        for finding in report["findings"]:

            c.drawString(
                60,
                y,
                "• " + finding
            )

            y -= 18

        if getattr(investigation, "explanation_path", None):

            if os.path.exists(investigation.explanation_path):

                y -= 20

                c.setFont(
                    "Helvetica-Bold",
                    14
                )

                c.drawString(
                    50,
                    y,
                    "Grad-CAM Explanation"
                )

                y -= 220

                c.drawImage(
                    investigation.explanation_path,
                    50,
                    y,
                    width=220,
                    height=220,
                    preserveAspectRatio=True
                )

        c.save()

        return pdf_path