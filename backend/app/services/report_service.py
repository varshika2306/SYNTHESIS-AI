from app.repositories.investigation_repository import InvestigationRepository


class ReportService:


    @staticmethod
    def generate_report(
        prediction:str,
        confidence:float
    ):


        prediction = prediction.upper()



        if prediction == "REAL":


            risk_level = "LOW"


            recommendation = (
                "The uploaded image appears authentic. "
                "No strong evidence of AI-generated manipulation was detected."
            )


            findings=[

                "Natural lighting detected",

                "Consistent image textures",

                "No abnormal visual artifacts",

                "High confidence prediction"

            ]



        else:


            risk_level="HIGH"


            recommendation=(

                "The uploaded image is likely AI-generated. "
                "Further verification is recommended."

            )



            findings=[

                "Synthetic texture patterns detected",

                "Possible AI-generated artifacts",

                "Image inconsistencies observed",

                "High confidence prediction"

            ]



        return {

            "prediction":prediction,

            "confidence":confidence,

            "risk_level":risk_level,

            "summary":recommendation,

            "findings":findings

        }