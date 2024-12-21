from fastapi import Response, Request, HTTPException
import cloudinary
import cloudinary.uploader
import cloudinary.api
import modal
import os

image = (modal.Image.debian_slim()
            .pip_install("fastapi[standard]")
            .pip_install("diffusers", "transformers", "accelerate")
            .pip_install("cloudinary")
         )

CONTAINER_IDLE_TIMEOUT = 5

with image.imports():
    from diffusers import AutoPipelineForText2Image

    import torch
    import io


app = modal.App(name="pentagram")

@app.cls(
    image=image,
    gpu="A10G",
    secrets=[modal.Secret.from_name("custom-secret")],
    container_idle_timeout=60 * CONTAINER_IDLE_TIMEOUT
    )
class WebApp:
    @modal.build()
    @modal.enter()
    def build_enter(self):
        self.pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16")
        self.pipe.to("cuda")
        from datetime import datetime, timezone
        
        # self.cloudinary = cloudinary
        self.start_time = datetime.now(timezone.utc)
        self.API_KEY = os.environ["API_SERVER_TOKEN"]
    
    @modal.enter()
    def enter(self):
        self.cloud_name = "dijhecnm4" 
        self.api_key = "682744179947431"
        self.api_secret = os.environ["CLOUDINARY_SECRET"]
        print("key is", self.api_secret)
        # Initialize the CloudinaryUploader
        self.uploader = CloudinaryUploader(self.cloud_name, self.api_key, self.api_secret)

    @modal.web_endpoint(docs=True)
    def generate_image(self, request: Request, prompt = "A cinematic shot of a baby racoon wearing an intricate italian priest robe."):
        api_key_from_request = request.headers.get("Authorization")
        print("key", api_key_from_request)
        # if api_key_from_request != self.API_KEY:
        #     return HTTPException(detail="Unauthorized", status_code=401)

        image = self.pipe(prompt=prompt, num_inference_steps=1, guidance_scale=0.0).images[0]
        buffer = io.BytesIO()
        # file_path = "./tmp/generated_image.jpg"
        # os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # image.save(file_path, format="JPEG")
        image.save(buffer, format="JPEG")
        # config = self.cloudinary.config(secure=True)
        
        # self.cloudinary.config(
        #     cloud_name=self.cloud_name,
        #     api_key=self.api_key,
        #     api_secret=self.api_secret
        # )
        secure_url = self.uploader.upload_image_from_buffer(buffer)

        # return Response(content=buffer.getvalue(), media_type="image/jpeg")
        return {
            "url": secure_url,
            "description": prompt
        }

    @modal.web_endpoint(docs=True)
    def web(self):
        from datetime import datetime, timezone
        current_time = datetime.now(timezone.utc)
        return {"status": "API is live", "start_time": self.start_time, "current_time": current_time}


class CloudinaryUploader:
    def __init__(self, cloud_name, api_key, api_secret):
        """
        Initializes the CloudinaryUploader with Cloudinary credentials.
        
        Parameters:
        - cloud_name: str, your Cloudinary cloud name
        - api_key: str, your Cloudinary API key
        - api_secret: str, your Cloudinary API secret
        """
        self.cloud_name = cloud_name
        self.api_key = api_key
        self.api_secret = api_secret
        self._configure_cloudinary()

    def _configure_cloudinary(self):
        """Configures the Cloudinary client with the provided credentials."""
        cloudinary.config(
            cloud_name=self.cloud_name,
            api_key=self.api_key,
            api_secret=self.api_secret,
            secure=True,
        )
        
    def upload_image_from_buffer(self, image_buffer):
        """
        Uploads an image from a buffer to Cloudinary.

        Parameters:
        - image_buffer: io.BytesIO object containing the image data

        Returns:
        - str: URL of the uploaded image
        """
        if not self._is_buffer_valid(image_buffer):
            raise ValueError("Buffer is not valid")

        print("buffer is valid")
        # Reset buffer position to the beginning
        image_buffer.seek(0)

        # Upload the image from the buffer
        response = cloudinary.uploader.upload(image_buffer)

        # Return the URL of the uploaded image
        return response['secure_url']
    
    def _is_buffer_valid(self, buffer):
        """
        Checks if the buffer is loaded correctly.

        Parameters:
        - buffer: io.BytesIO object to check

        Returns:
        - bool: True if the buffer is valid, False otherwise
        """
        # Check if the buffer is empty
        buffer.seek(0, io.SEEK_END)
        buffer_size = buffer.tell()
        if buffer_size == 0:
            return False

        # Optionally, check the start of the buffer to ensure it resembles an image file
        buffer.seek(0)
        start = buffer.read(10)
        buffer.seek(0)

        # Check for common image file headers (JPEG, PNG, GIF)
        if start.startswith(b'\xff\xd8'):  # JPEG header
            return True
        elif start.startswith(b'\x89PNG\r\n\x1a\n'):  # PNG header
            return True
        elif start.startswith(b'GIF87a') or start.startswith(b'GIF89a'):  # GIF header
            return True

        # If none of the headers match, consider the buffer invalid
        return False