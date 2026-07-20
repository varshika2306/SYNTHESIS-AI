import torch
import cv2
import numpy as np


class GradCAM:

    def __init__(self, model, target_layer):

        self.model = model
        self.target_layer = target_layer

        self.gradients = None
        self.activations = None


        target_layer.register_forward_hook(
            self.save_activation
        )

        target_layer.register_full_backward_hook(
            self.save_gradient
        )


    def save_activation(
        self,
        module,
        input,
        output
    ):

        self.activations = output.detach()



    def save_gradient(
        self,
        module,
        grad_input,
        grad_output
    ):

        self.gradients = grad_output[0].detach()



    def generate(
        self,
        image_tensor,
        class_index
    ):

        self.model.zero_grad()


        # Enable gradients for Grad-CAM
        image_tensor.requires_grad = True


        output = self.model(
            image_tensor
        )


        score = output[:, class_index]


        score.backward()


        gradients = self.gradients

        activations = self.activations



        # Global Average Pooling
        weights = torch.mean(
            gradients,
            dim=(2, 3),
            keepdim=True
        )


        # Weighted activation maps
        cam = torch.sum(
            weights * activations,
            dim=1
        )


        # ReLU
        cam = torch.relu(
            cam
        )


        cam = cam.squeeze()


        cam = cam.cpu().detach().numpy()



        # Normalize
        cam = (
            cam - cam.min()
        ) / (
            cam.max() - cam.min() + 1e-8
        )


        # Resize to image size
        cam = cv2.resize(
            cam,
            (224, 224)
        )


        return cam





def save_heatmap(
    original_path,
    heatmap,
    output_path
):


    original = cv2.imread(
        original_path
    )


    original = cv2.resize(
        original,
        (224,224)
    )


    heatmap_image = np.uint8(
        255 * heatmap
    )


    heatmap_image = cv2.applyColorMap(
        heatmap_image,
        cv2.COLORMAP_JET
    )


    overlay = cv2.addWeighted(
        original,
        0.6,
        heatmap_image,
        0.4,
        0
    )


    cv2.imwrite(
        output_path,
        overlay
    )


    return output_path