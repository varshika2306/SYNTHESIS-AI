import torch.nn as nn
from torchvision.models import efficientnet_b0


def create_model():
    """
    Create EfficientNet-B0 for binary classification.
    """

    model = efficientnet_b0(weights=None)

    # Freeze all layers
    for param in model.parameters():
        param.requires_grad = False

    # Unfreeze last feature block
    for param in model.features[-1].parameters():
        param.requires_grad = True

    # Binary classifier
    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(
            model.classifier[1].in_features,
            2
        )
    )

    return model