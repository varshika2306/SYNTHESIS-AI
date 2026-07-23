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

        print("=" * 60)
        print("STEP A - Predictor initialized")

        try:
            self.device = torch.device(
                "cuda" if torch.cuda.is_available() else "cpu"
            )
            print("Selected device:", self.device)

            self.model = create_model()
        except Exception:
            print("STEP A FAILED - Predictor initialization")
            traceback.print_exc()
            raise

        model_path = os.path.join(
            os.path.dirname(__file__),
            "best_model.pth"
        )

        print("STEP B - Model path found")
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

            print("STEP C - Model loaded")
        except Exception:
            print("STEP C FAILED - Model load failed")
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
            print("STEP D - GradCAM initialized")
        except Exception:
            print("STEP D FAILED - GradCAM initialization failed")
            traceback.print_exc()
            self.gradcam = None

        print("=" * 60)

    def predict(self, image_path: str):

        print("=" * 60)
        print("STEP E - Image opened")
        print("Image path:", image_path)

        try:
            image = Image.open(image_path).convert("RGB")
        except Exception:
            print("STEP E FAILED - Image open failed")
            traceback.print_exc()
            raise

        print("STEP F - Image transformed")
        try:
            tensor = image_transform(image)
            print("Tensor shape:", tensor.shape)
        except Exception:
            print("STEP F FAILED - Image transform failed")
            traceback.print_exc()
            raise

        print("STEP G - Tensor moved to device")
        try:
            tensor = tensor.unsqueeze(0).to(self.device)
        except Exception:
            print("STEP G FAILED - Tensor move to device failed")
            traceback.print_exc()
            raise

        print("STEP H - Model inference started")
        try:
            outputs = self.model(tensor)
            print("STEP H - Model inference completed")
        except Exception:
            print("STEP H FAILED - Model inference failed")
            traceback.print_exc()
            raise

        print("STEP I - Softmax calculated")
        try:
            probabilities = torch.softmax(
                outputs,
                dim=1
            )
            print("Softmax output shape:", probabilities.shape)
        except Exception:
            print("STEP I FAILED - Softmax calculation failed")
            traceback.print_exc()
            raise

        print("STEP J - Prediction obtained")
        try:
            confidence, predicted = torch.max(
                probabilities,
                dim=1
            )
            predicted_class = predicted.item()
            print("Prediction class index:", predicted_class)
            print("Confidence raw:", confidence.item())
        except Exception:
            print("STEP J FAILED - Prediction extraction failed")
            traceback.print_exc()
            raise

        heatmap_path = None

        if self.gradcam is not None:
            print("STEP K - GradCAM generation started")
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
                os.makedirs(folder, exist_ok=True)

                heatmap_path = os.path.join(
                    folder,
                    f"{uuid.uuid4()}.jpg"
                )

                save_heatmap(
                    image_path,
                    heatmap,
                    heatmap_path
                )

                print("STEP L - Heatmap saved")
                print("Heatmap path:", heatmap_path)
            except Exception:
                print("STEP K FAILED - GradCAM generation failed")
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

        print("STEP M - Prediction returned")
        print("Prediction:", result["prediction"])
        print("Confidence:", result["confidence"])
        print("Heatmap path:", result["heatmap"])

        return result


_predictor = None


def get_predictor():

    global _predictor

    if _predictor is None:
        _predictor = Predictor()

    return _predictor