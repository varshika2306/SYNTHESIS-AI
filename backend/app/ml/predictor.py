import os
import traceback
import uuid

import torch
from PIL import Image

from app.ml.model import create_model
from app.ml.transforms import image_transform
from app.ml.gradcam import GradCAM, save_heatmap


class Predictor:

    def __init__(self):

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print("=" * 60)
        print("Loading AI model...")
        print("Device:", self.device)

        self.model = create_model()

        model_path = os.path.join(
            os.path.dirname(__file__),
            "best_model.pth"
        )

        print("Model Path:", model_path)

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found: {model_path}"
            )

        try:

            try:
                state_dict = torch.load(
                    model_path,
                    map_location=self.device,
                    weights_only=True
                )
            except TypeError:
                state_dict = torch.load(
                    model_path,
                    map_location=self.device
                )

            self.model.load_state_dict(state_dict)

            self.model.to(self.device)
            self.model.eval()

            print("Model loaded successfully.")

        except Exception:

            print("MODEL LOAD FAILED")
            traceback.print_exc()
            raise

        self.classes = [
            "FAKE",
            "REAL"
        ]

        try:

            self.gradcam = GradCAM(
                self.model,
                self.model.features[-1]
            )

            print("GradCAM initialized.")

        except Exception:

            print("GradCAM initialization failed.")
            traceback.print_exc()

            self.gradcam = None

        print("=" * 60)

    def predict(self, image_path: str):

        try:

            print("=" * 60)
            print("Starting prediction")
            print("Image:", image_path)

            image = Image.open(image_path).convert("RGB")

            tensor = image_transform(image)

            tensor = tensor.unsqueeze(0).to(self.device)

            outputs = self.model(tensor)

            probabilities = torch.softmax(
                outputs,
                dim=1
            )

            confidence, predicted = torch.max(
                probabilities,
                dim=1
            )

            predicted_class = predicted.item()

            heatmap_path = None

            if self.gradcam is not None:

                try:

                    heatmap = self.gradcam.generate(
                        tensor,
                        predicted_class
                    )

                    folder = os.path.join(
                        "app",
                        "uploads",
                        "heatmaps"
                    )

                    os.makedirs(
                        folder,
                        exist_ok=True
                    )

                    heatmap_path = os.path.join(
                        folder,
                        f"{uuid.uuid4()}.jpg"
                    )

                    save_heatmap(
                        image_path,
                        heatmap,
                        heatmap_path
                    )

                    print("Heatmap saved:", heatmap_path)

                except Exception:

                    print("GradCAM generation failed")
                    traceback.print_exc()

                    heatmap_path = None

            result = {
                "prediction": self.classes[predicted_class],
                "confidence": round(
                    confidence.item() * 100,
                    2
                ),
                "probabilities": {
                    "FAKE": round(
                        probabilities[0][0].item() * 100,
                        2
                    ),
                    "REAL": round(
                        probabilities[0][1].item() * 100,
                        2
                    ),
                },
                "heatmap": heatmap_path
            }

            print("Prediction Success")
            print(result)

            return result

        except Exception:

            print("=" * 60)
            print("Prediction Failed")
            traceback.print_exc()
            raise


_predictor = None


def get_predictor():

    global _predictor

    if _predictor is None:
        _predictor = Predictor()

    return _predictor