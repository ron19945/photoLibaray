import React, { useState } from "react";
import { captureImage } from "../utils/captureImage";
import { sendPhotosToAPI } from "../utils/apiHelper";
import { useCamera } from "../hooks/useCamera";

const CameraComponent = ({ onComplete, apiEndpoint }) => {
  const [uploading, setUploading] = useState(false);
  const {
    videoRef,
    pictures,
    currentStep,
    steps,
    startCamera,
    stopCamera,
    takePicture,
    reset,
    isComplete,
  } = useCamera();

  const handleCapture = async () => {
    const imageData = captureImage(videoRef.current);
    takePicture(imageData);

    if (isComplete) {
      stopCamera();
      setUploading(true);

      try {
        // Send photos to the API endpoint
        const response = await sendPhotosToAPI(apiEndpoint, pictures);
        console.log("Photos uploaded successfully:", response);

        // Notify parent application
        if (onComplete) {
          onComplete(pictures, response);
        }
      } catch (error) {
        console.error("Failed to upload photos:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "auto" }} />
      <div>
        <button onClick={startCamera} disabled={Boolean(videoRef.current?.srcObject)}>
          Start Camera
        </button>
        <button onClick={handleCapture} disabled={isComplete || !videoRef.current?.srcObject || uploading}>
          {uploading
            ? "Uploading..."
            : isComplete
            ? "Done"
            : `Capture ${steps[currentStep]}`}
        </button>
        <button onClick={stopCamera} disabled={!videoRef.current?.srcObject || uploading}>
          Stop Camera
        </button>
        <button onClick={reset} disabled={uploading}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default CameraComponent;
