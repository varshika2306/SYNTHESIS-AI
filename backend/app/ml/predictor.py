import os
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

        print("Loading AI model...")

        self.model = create_model()

        model_path = os.path.join(
            os.path.dirname(__file__),
            "best_model.pth"
        )

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found: {model_path}"
            )

        state_dict = torch.load(
            model_path,
            map_location=self.device,
            weights_only=True
        )

        self.model.load_state_dict(state_dict)

        self.model.to(self.device)
        self.model.eval()

        self.classes = [
            "FAKE",
            "REAL"
        ]

        self.gradcam = GradCAM(
            self.model,
            self.model.features[-1]
        )

        print("Model loaded successfully.")

    def predict(self, image_path: str):

        original_image = Image.open(
            image_path
        ).convert("RGB")

        image_tensor = image_transform(
            original_image
        )

        image_tensor = (
            image_tensor
            .unsqueeze(0)
            .to(self.device)
        )

        outputs = self.model(image_tensor)

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

        confidence, predicted = torch.max(
            probabilities,
            dim=1
        )

        predicted_class = predicted.item()

        heatmap = self.gradcam.generate(
            image_tensor,
            predicted_class
        )

        heatmap_folder = os.path.join(
            "app",
            "uploads",
            "heatmaps"
        )

        os.makedirs(
            heatmap_folder,
            exist_ok=True
        )

        heatmap_path = os.path.join(
            heatmap_folder,
            "heatmap.jpg"
        )

        save_heatmap(
            image_path,
            heatmap,
            heatmap_path
        )

        return {
            "prediction": self.classes[predicted_class],
            "confidence": round(confidence.item() * 100, 2),
            "probabilities": {
                "FAKE": round(probabilities[0][0].item() * 100, 2),
                "REAL": round(probabilities[0][1].item() * 100, 2),
            },
            "heatmap": heatmap_path,
        }


# Lazy-loaded singleton
_predictor = None


def get_predictor():
    global _predictor

    if _predictor is None:
        _predictor = Predictor()

    return _predictor