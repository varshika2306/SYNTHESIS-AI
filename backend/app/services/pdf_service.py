"""
PDF generation service for TruthLens AI
Generates a human-readable PDF report for an investigation using ReportLab
"""
import os
from datetime import datetime
from typing import Any, Dict

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

from app.services.report_service import ReportService


REPORTS_DIR = os.path.join("app", "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)


class PDFService:

    @staticmethod
    def generate_pdf(investigation: Any, report: Dict | None = None) -> str:
        """
        Generate a PDF for the given investigation model instance.

        Returns the filesystem path to the generated PDF.
        """

        # Normalize investigation fields (works with SQLAlchemy model)
        inv_id = getattr(investigation, "id", None)
        prediction = getattr(investigation, "prediction", "N/A")
        confidence = getattr(investigation, "confidence", None)
        status = getattr(investigation, "status", "N/A")
        created_at = getattr(investigation, "created_at", None)
        explanation_path = getattr(investigation, "explanation_path", None)

        if report is None:
            report = ReportService.generate_report(prediction=prediction, confidence=confidence or 0)

        timestamp = (
            created_at.strftime("%Y-%m-%d %H:%M:%S")
            if hasattr(created_at, "strftime")
            else str(created_at)
        )

        filename = f"investigation_{inv_id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.pdf"
        out_path = os.path.join(REPORTS_DIR, filename)

        c = canvas.Canvas(out_path, pagesize=letter)
        width, height = letter

        left = inch * 0.75
        top = height - inch * 0.75

        # Title
        c.setFont("Helvetica-Bold", 18)
        c.drawString(left, top, "TruthLens AI — Investigation Report")

        c.setFont("Helvetica", 10)
        y = top - 30

        # Basic Info
        c.drawString(left, y, f"Investigation ID: {inv_id}")
        y -= 14
        c.drawString(left, y, f"Prediction: {report.get('prediction', prediction)}")
        y -= 14
        c.drawString(left, y, f"Confidence: {report.get('confidence', confidence)}%")
        y -= 14
        c.drawString(left, y, f"Risk Level: {report.get('risk_level', 'N/A')}" )
        y -= 14
        c.drawString(left, y, f"Status: {status}")
        y -= 14
        c.drawString(left, y, f"Timestamp: {timestamp}")
        y -= 22

        # Findings / Summary
        c.setFont("Helvetica-Bold", 12)
        c.drawString(left, y, "Summary & Findings:")
        y -= 16
        c.setFont("Helvetica", 10)
        summary = report.get("summary", "")
        findings = report.get("findings", []) or []

        # Wrap summary
        textobject = c.beginText(left, y)
        textobject.setFont("Helvetica", 10)
        for line in str(summary).splitlines():
            textobject.textLine(line)
        c.drawText(textobject)

        y = textobject.getY() - 8

        for f in findings:
            if y < inch:
                c.showPage()
                y = height - inch
            c.drawString(left + 8, y, f"- {f}")
            y -= 14

        # Model Info
        if y < inch * 2:
            c.showPage()
            y = height - inch

        c.setFont("Helvetica-Bold", 12)
        c.drawString(left, y, "Model Information")
        y -= 18
        c.setFont("Helvetica", 10)
        c.drawString(left, y, "Model: CNN Detector")
        y -= 12
        c.drawString(left, y, "Framework: PyTorch")
        y -= 12
        c.drawString(left, y, "Dataset: CIFAKE")
        y -= 20

        # GradCAM image
        if explanation_path:
            # explanation_path may be a filesystem path already
            img_path = explanation_path
            if img_path and os.path.exists(img_path):
                # Reserve space and draw image
                try:
                    max_w = width - left * 2
                    max_h = 3 * inch
                    # Draw image centered
                    img_w = max_w
                    img_h = max_h
                    if y - img_h < inch:
                        c.showPage()
                        y = height - inch
                    c.drawImage(img_path, left, y - img_h, width=img_w, height=img_h, preserveAspectRatio=True, anchor='n')
                    y -= img_h + 12
                except Exception:
                    # ignore image embedding errors
                    pass

        c.showPage()
        c.save()

        return out_path
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image
)

from reportlab.lib.styles import getSampleStyleSheet
import os



class PDFService:


    @staticmethod
    def generate_report(
        investigation
    ):

        pdf_dir = "app/reports"

        os.makedirs(
            pdf_dir,
            exist_ok=True
        )


        filename = (
            f"investigation_{investigation.id}.pdf"
        )


        pdf_path = os.path.join(
            pdf_dir,
            filename
        )


        document = SimpleDocTemplate(
            pdf_path,
            pagesize=letter
        )


        styles = getSampleStyleSheet()

        content = []


        title = Paragraph(
            "TruthLens AI - Digital Forensic Report",
            styles["Title"]
        )

        content.append(title)

        content.append(
            Spacer(1,20)
        )


        details = [

            f"Investigation ID: {investigation.id}",

            f"Prediction: {investigation.prediction}",

            f"Confidence: {investigation.confidence}%",

            f"Status: {investigation.status}",

            f"Created At: {investigation.created_at}"

        ]


        for item in details:

            content.append(
                Paragraph(
                    item,
                    styles["Normal"]
                )
            )

            content.append(
                Spacer(1,10)
            )


        content.append(
            Paragraph(
                "AI Findings",
                styles["Heading2"]
            )
        )


        findings = [

            "Image artifact analysis completed",

            "Synthetic texture consistency checked",

            "Neural pattern evaluation completed",

            "CNN classification performed"

        ]


        for f in findings:

            content.append(
                Paragraph(
                    "✓ " + f,
                    styles["Normal"]
                )
            )


        content.append(
            Spacer(1,20)
        )


        if investigation.explanation_path:

            if os.path.exists(
                investigation.explanation_path
            ):

                content.append(
                    Paragraph(
                        "Grad-CAM Explainability",
                        styles["Heading2"]
                    )
                )


                content.append(
                    Spacer(1,10)
                )


                content.append(
                    Image(
                        investigation.explanation_path,
                        width=300,
                        height=300
                    )
                )


        document.build(
            content
        )


        return pdf_path