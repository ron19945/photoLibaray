import { useState, useRef } from "react";

export const useCamera = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = ["front", "back", "side1", "side2"]; // Sequence of pictures

  const startCamera = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(videoStream);
      if (videoRef.current) videoRef.current.srcObject = videoStream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takePicture = (imageData) => {
    const newPicture = {
      step: steps[currentStep],
      image: imageData,
    };
    setPictures([...pictures, newPicture]);
    setCurrentStep((prev) => prev + 1);
  };

  const reset = () => {
    setPictures([]);
    setCurrentStep(0);
  };

  const isComplete = currentStep >= steps.length;

  return {
    videoRef,
    pictures,
    currentStep,
    steps,
    startCamera,
    stopCamera,
    takePicture,
    reset,
    isComplete,
  };
};
