import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import useIsMobile from '../hooks/useIsMobile';

const WalletImportInline = ({ onLogin }) => {
  const [inputKey, setInputKey] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [scanning, setScanning] = useState(false);
  const isMobile = useIsMobile();
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const trimmed = inputKey.trim();
    const isHex = /^[0-9a-fA-F]{64}$/.test(trimmed);
    setIsValid(isHex);
  }, [inputKey]);

  useEffect(() => {
    if (!scanning) return;

    let stream;
    let scanInterval;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((mediaStream) => {
        stream = mediaStream;
        const video = videoRef.current;

        if (video) {
          video.srcObject = stream;
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
                const scanned = code.data.trim();
                if (/^[0-9a-fA-F]{64}$/.test(scanned)) {
                  clearInterval(scanInterval);
                  stream.getTracks().forEach((t) => t.stop());
                  setInputKey(scanned);
                  setScanning(false);
                  onLogin(scanned);
                }
              }
            }
          }, 500);
        }
      })
      .catch(console.error);

    return () => {
      clearInterval(scanInterval);
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [scanning]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) onLogin(inputKey.trim());
  };

  return (
    <div className="inline-login-form">
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter Private Key"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          className={`key-input ${inputKey ? (isValid ? 'valid' : 'invalid') : ''}`}
        />
        <button type="submit" disabled={!isValid}>
          Import Wallet
        </button>
      </form>

      {/* {isMobile && !scanning && (
        <button className="scan-btn" onClick={() => setScanning(true)}>
          📷 Scan QR
        </button>
      )} */}

      {/* {scanning && (
        <div className="qr-inline-scanner">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              borderRadius: '8px',
              background: 'black',
              minHeight: '200px',
              marginTop: '0.5rem',
            }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )} */}
    </div>
  );
};

export default WalletImportInline;