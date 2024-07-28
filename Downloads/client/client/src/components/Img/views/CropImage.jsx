import { useCallback, useState } from "react";
import ImageCropper from "../comp/ImageCropper";
import FileDropZone from "../comp/FileDropZone";
import AppSlider from "../comp/AppSlider";
import { BiCloudDownload } from "react-icons/bi";
import '../views/crop.css'; // Import the CSS file for CropImage component

export default function CropImage() {
  const [remoteImage, setRemoteImage] = useState("");
  const [localImage, setLocalImage] = useState("");
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [rotation, setRotation] = useState(0);

  const isImageSelected = remoteImage || localImage ? true : false;

  const onDrop = useCallback((acceptedFiles) => {
    setRemoteImage("");
    setLocalImage(URL.createObjectURL(acceptedFiles[0]));
  }, []);

  const handleOnZoom = useCallback((zoomValue) => {
    setZoom(zoomValue);
  }, []);

  const handleOnRotation = useCallback((rotationValue) => {
    setRotation(rotationValue);
  }, []);

  const downloadImage = async () => {
    if (!croppedImage) return;
    const link = document.createElement("a");
    const name = `${Date.now()}_wallpaper`;
    link.download = name;
    link.href = URL.createObjectURL(croppedImage);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <div className="controls">
        <input
          className="url-input"
          placeholder="https://images.unsplash.com/photo-1691673236501..."
          value={remoteImage}
          onChange={({ target }) => {
            setLocalImage("");
            setRemoteImage(target.value);
          }}
        />
        {!isImageSelected && <FileDropZone onDrop={onDrop} />}

        {isImageSelected && (
          <>
            <AppSlider
              min={0}
              max={360}
              defaultValue={0}
              value={rotation}
              label="Rotate"
              onChange={handleOnRotation}
            />

            <AppSlider
              min={1}
              max={3}
              value={zoom}
              label="Zoom"
              defaultValue={1}
              onChange={handleOnZoom}
            />

            <button
              className="button-download"
              onClick={downloadImage}
            >
              <BiCloudDownload size={24} />
              <span>Download</span>
            </button>
          </>
        )}
      </div>

      <div className="image-cropper-container">
        {isImageSelected && (
          <ImageCropper
            zoom={zoom}
            onZoomChange={handleOnZoom}
            rotation={rotation}
            onRotationChange={setRotation}
            source={remoteImage || localImage}
            onCrop={setCroppedImage}
            width={1080}
            height={1920}
          />
        )}
      </div>
    </div>
  );
}
