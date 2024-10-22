import React, { useEffect, useRef, useState } from "react";
 import "@tensorflow/tfjs-backend-webgl";
import * as mobilenet from "@tensorflow-models/mobilenet";

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [prediction, setPrediction] = useState<string>("");

  useEffect(() => {
     const loadModel = async () => {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    };

    loadModel();

     const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("فشل في الوصول إلى الكاميرا:", err);
        });
    };

    startVideo();
  }, []);

  const detectObjects = async () => {
    if (model && videoRef.current) {
      const videoElement = videoRef.current;
      const predictions = await model.classify(videoElement);

      if (predictions.length > 0) {
        setPrediction(
          `${predictions[0].className} - ${Math.round(
            predictions[0].probability * 100
          )}%`
        );
      } else {
        setPrediction("No objects detected");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      detectObjects();
    }, 1000); 

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Real-time Object Detection
      </h1>
      <video
        ref={videoRef}
        width="640"
        height="480"
        className="rounded-lg shadow-lg border"
      />
      <p className="mt-4 p-4 bg-white rounded-lg shadow-lg w-3/4">
        {prediction}
      </p>
    </div>
  );
};

export default App;
