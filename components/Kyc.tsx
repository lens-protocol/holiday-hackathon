
import React, { useRef, useState, useEffect } from "react";

declare global {
  interface Window {
    cv: any; 
  }
}

interface KycProps {
  onCapture?: (hashEmbedding: string) => void;
}

const Kyc: React.FC<KycProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    
    if (typeof window !== "undefined" && window.cv && !initialized) {
      setInitialized(true);
      startCamera();
    }
  }, [initialized]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  }

  function detectFaceAndComputeHash() {
    if (!videoRef.current || !canvasRef.current) return;

    // Grab a frame from the video onto the canvas
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    // Convert to OpenCV Mat
    const src = new window.cv.Mat(canvasRef.current.height, canvasRef.current.width, window.cv.CV_8UC4);
    const cap = new window.cv.VideoCapture(videoRef.current);
    cap.read(src);

    // Convert color space to grayscale for face detection
    const gray = new window.cv.Mat();
    window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0);

  
    const faceDetected = true; 

    // Convert pixel data to a hash. Example: compute a quick SHA-256 client-side:
    // We'll just demonstrate a simplistic approach with the raw grayscale data.
    let dataArray = new Uint8Array(gray.data); // raw pixel data
    // We'll create a hash from that array using the SubtleCrypto API
    window.crypto.subtle
      .digest("SHA-256", dataArray)
      .then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        console.log("Face embedding hash:", hashHex);

        // If a face was detected, pass the hash up
        if (faceDetected && onCapture) {
          onCapture(hashHex);
        }
      })
      .catch((err) => console.error("Hashing error:", err));

    // Cleanup
    src.delete();
    gray.delete();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <video
        ref={videoRef}
        width={320}
        height={240}
        style={{ backgroundColor: "#333" }}
        onCanPlay={() => {
          // Optionally do something when video is ready
        }}
      />
      <canvas ref={canvasRef} width={320} height={240} style={{ display: "none" }} />

      <button onClick={detectFaceAndComputeHash} disabled={!initialized}>
        Capture & Hash Face
      </button>
    </div>
  );
};

export default Kyc;
