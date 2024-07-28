import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { loadImage } from "../utils/helper";
import '../views/crop.css'; // Import the CSS file for CropImage component

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function rotateSize(width, height, rotation) {
  const rotRad = degreesToRadians(rotation);

  return {
    boxWidth:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    boxHeight:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

const ImageCropper = ({
  source,
  height,
  width,
  zoom,
  rotation,
  onCrop,
  onZoomChange,
  onRotationChange,
}) => {
  const [loading, setLoading] = useState(true);
  const [crop, setCrop] = useState({ x: 100, y: 0, width, height });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  const desiredWidth = width;
  const desiredHeight = height;

  const handleCrop = (_, croppedAreaPixels) => {
    try {
      if (!croppedAreaPixels) return;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const image = new Image();
      image.crossOrigin = "anonymous";

      image.onload = () => {
        // set the size for canvas
        const { boxWidth, boxHeight } = rotateSize(
          image.width,
          image.height,
          rotation
        );

        const rotRad = degreesToRadians(rotation);
        canvas.width = boxWidth;
        canvas.height = boxHeight;

        ctx.translate(boxWidth / 2, boxHeight / 2);
        ctx.rotate(rotRad);
        ctx.translate(-image.width / 2, -image.height / 2);

        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(image, 0, 0);

        const croppedCanvas = document.createElement("canvas");
        const croppedCtx = croppedCanvas.getContext("2d");

        if (!croppedCtx) return;

        const { x, y, width, height } = croppedAreaPixels;

        croppedCanvas.width = desiredWidth;
        croppedCanvas.height = desiredHeight;
        croppedCtx.drawImage(
          canvas,
          x,
          y,
          width,
          height,
          0,
          0,
          desiredWidth,
          desiredHeight
        );

        croppedCanvas.toBlob((blob) => {
          if (blob) onCrop(blob);
        }, "image/png");
      };

      image.onerror = (error) => {
        console.error("Error loading image for cropping:", error);
        setError("Failed to load image for cropping.");
      };

      image.src = source;
    } catch (error) {
      console.log(error);
    }
  };

  const calculateSize = async () => {
    setLoading(true);
    try {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) {
        console.log("Container rect not found");
        setError("Container not found.");
        return;
      }

      console.log("Loading image...");
      const { width, height, orientation } = await loadImage(
        source,
        containerRect.width * (9 / 16),
        containerRect.height * (9 / 16)
      );

      const isPortrait = orientation === "portrait";

      setSize({ width, height: isPortrait ? width : height });
      console.log("Image loaded successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error loading image:", error);
      setError("Failed to load image.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // this calculation will decide the size of our canvas so that we can have the non destructive UI
    calculateSize();
  }, [source, containerRef]);

  return (
    <div
      className="image-cropper-container"
      ref={containerRef}
    >
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div
          className="relative mx-auto"
          style={{ width: size.width, height: size.height }}
        >
          <Cropper
            image={source}
            crop={crop}
            zoom={zoom}
            aspect={12 / 16}
            showGrid={false}
            rotation={rotation}
            onCropChange={(props) => setCrop({ ...props, width, height })}
            onZoomChange={onZoomChange}
            onRotationChange={onRotationChange}
            onCropComplete={handleCrop}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
