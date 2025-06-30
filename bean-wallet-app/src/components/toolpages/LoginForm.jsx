import React, { useState, useEffect, useRef} from 'react';
import './LoginForm.css';
import { motion } from 'framer-motion';
import useIsMobile from '.././hooks/useIsMobile'; 
import jsQR from 'jsqr';



const LoginForm = ({ onLogin }) => {
  const [inputKey, setInputKey] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [scanning, setScanning] = useState(false);
  const isMobile = useIsMobile(); 
  const [showSuccessBean, setShowSuccessBean] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  const [streamError, setStreamError] = useState(null);


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
  
          const handleLoaded = () => {
            console.log("🎥 Video metadata loaded");
  
            video.play();
  
            scanInterval = setInterval(() => {
              const canvas = canvasRef.current;
              // console.log("👀 scanInterval running");
              // console.log("📸 Frame:", canvas.width, canvas.height);


              if (video.readyState >= 2 && canvas) {
                const context = canvas.getContext('2d');
                canvas.width = video.videoWidth || 320;
                canvas.height = video.videoHeight || 240;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                // console.log("📦 QR scan result:", code);

                // console.log("🟢 Scanning frame...");
                if (code?.data) {
                  // console.log("✅ QR Detected:", code.data);
                  const scanned = code.data.trim();
                  if (/^[0-9a-fA-F]{64}$/.test(scanned)) {
                    clearInterval(scanInterval);
                    stream.getTracks().forEach((track) => track.stop());
                    setInputKey(scanned);
                    setScanning(false);
                    setShowSuccessBean(true);
                    setTimeout(() => {
                      setShowSuccessBean(false);
                      onLogin(scanned); // ⬅️ triggers dashboard redirect
                    }, 1800); // make this match the animation duration
                  }
                }
              }
            }, 500);
          };
  
          // Attach once
          video.addEventListener("loadedmetadata", handleLoaded);
        }
      })
      .catch((err) => {
        console.error("Camera error:", err);
        setStreamError(err.message);
      });
  
    return () => {
      clearInterval(scanInterval);
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [scanning]);
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onLogin(inputKey.trim());
    }
  };



  return (
    <motion.div className="login-form-container">
      <div className="login-card">
        
        {showSuccessBean && (
          <div className="bean-overlay">
            <img
              key={Date.now()}
              src="/SucessBean.png"
              alt="Success Bean"
              className="success-bean"
            />
          </div>
        )}

        <div className={`login-form-content ${showSuccessBean ? 'hidden' : ''}`}>
          <h2 className="login-title">🔐 Unlock Your Wallet</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="password"
              placeholder="Enter Private Key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className={`key-input ${inputKey ? (isValid ? 'valid' : 'invalid') : ''}`}
            />
            <button type="submit" disabled={!isValid}>
              Access Wallet
            </button>
          </form>

          {isMobile && !scanning && (
            <button className="scan-btn" onClick={() => setScanning(true)}>
              📷 Scan QR Code
            </button>
          )}

          {scanning && (
            <div className="qr-scanner">
              {streamError && <p style={{ color: 'red' }}>Camera Error: {streamError}</p>}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  background: 'black',
                  minHeight: '250px',
                }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <button className="cancel-scan" onClick={() => setScanning(false)}>
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;

