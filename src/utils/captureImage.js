export const captureImage = (videoElement) => {
    if (!videoElement) throw new Error("Video element not found.");
  
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
  
    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
    // Return image as base64
    return canvas.toDataURL("image/png");
  };
  