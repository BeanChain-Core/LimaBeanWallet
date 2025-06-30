import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const QRScanner = ({ onScan, onCancel }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [streamError, setStreamError] = useState(null);

  useEffect(() => {
    let stream;
    let scanInterval;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((mediaStream) => {
        stream = mediaStream;
        const video = videoRef.current;

        if (video) {
          video.srcObject = stream;

          const handleLoaded = () => {
            video.play();
            scanInterval = setInterval(() => {
              const canvas = canvasRef.current;
              if (video.readyState >= 2 && canvas) {
                const ctx = canvas.getContext('2d');
                canvas.width = video.videoWidth || 320;
                canvas.height = video.videoHeight || 240;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                if (code?.data) {
                  clearInterval(scanInterval);
                  stream.getTracks().forEach(track => track.stop());
                  onScan(code.data.trim());
                }
              }
            }, 400);
          };

          video.addEventListener('loadedmetadata', handleLoaded);
        }
      })
      .catch((err) => {
        console.error("Camera error:", err);
        setStreamError(err.message);
      });

    return () => {
      clearInterval(scanInterval);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div style={{ marginTop: '1rem' }}>
      {streamError && <p style={{ color: 'red' }}>Camera Error: {streamError}</p>}
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={onCancel} style={{ marginTop: '0.5rem' }}>❌ Cancel</button>
    </div>
  );
};

export default QRScanner;
