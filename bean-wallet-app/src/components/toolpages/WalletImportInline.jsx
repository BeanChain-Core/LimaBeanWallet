import React, { useState, useEffect, useRef } from 'react';
import { mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import jsQR from 'jsqr';
import useIsMobile from '../hooks/useIsMobile';
import './WalletImportInline.css'
const WalletImportInline = ({ onLogin }) => {
  const [inputKey, setInputKey] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [mode, setMode] = useState('private'); // 'private' or 'seed'
  const [scanning, setScanning] = useState(false);
  const [streamError, setStreamError] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();
  const isMobile = useIsMobile();
  const [showPrivate, setShowPrivate] = useState(false);

  useEffect(() => {
    const trimmed = inputKey.trim();
    if (mode === 'private') {
      setIsValid(/^[0-9a-fA-F]{64}$/.test(trimmed));
    } else {
      setIsValid(validateMnemonic(trimmed, wordlist));
    }
  }, [inputKey, mode]);

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

          video.addEventListener("loadedmetadata", () => {
            video.play();

            scanInterval = setInterval(() => {
              const canvas = canvasRef.current;
              if (video.readyState >= 2 && canvas) {
                const context = canvas.getContext('2d');
                canvas.width = video.videoWidth || 320;
                canvas.height = video.videoHeight || 240;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);

                if (code?.data) {
                  const scanned = code.data.trim();
                  if (/^[0-9a-fA-F]{64}$/.test(scanned)) {
                    clearInterval(scanInterval);
                    stream.getTracks().forEach((track) => track.stop());
                    setInputKey(scanned);
                    setScanning(false);
                    onLogin(scanned);
                  }
                }
              }
            }, 500);
          });
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
    const trimmed = inputKey.trim();

    if (mode === 'private' && isValid) {
      onLogin(trimmed);
    } else if (mode === 'seed' && isValid) {
      const seed = mnemonicToSeedSync(trimmed);
      const privateKey = bytesToHex(sha256(seed).slice(0, 32));
      onLogin(privateKey);
    }
  };

  return (
    <div className="wallet-import-box">
      <h2>🔐 Import Wallet</h2>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={mode === 'private' ? 'active' : ''}
          onClick={() => {
            setInputKey('');
            setIsValid(false);
            setMode('private');
          }}
        >
          Private Key
        </button>
        <button
          className={mode === 'seed' ? 'active' : ''}
          onClick={() => {
            setInputKey('');
            setIsValid(false);
            setMode('seed');
          }}
        >
          Seed Phrase
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'private' ? (
          <input
            // type="password"
            placeholder="Enter Private Key"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className={`key-input ${inputKey ? (isValid ? 'valid' : 'invalid') : ''}`}
          />
        ) : (
          <textarea
            placeholder="Enter 12-word Seed Phrase"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className={`key-input seed-input ${inputKey ? (isValid ? 'valid' : 'invalid') : ''}`}
            rows={3}
          />
        )}
        {mode === 'seed' && (
          <div className="seed-help">
             Trouble entering your seed?{' '}
            <a href="/about/seed-phrase-entry">
              Learn more
            </a>
          </div>
        )}
        <button type="submit" disabled={!isValid}>
          Import Wallet
        </button>
      </form>

      {/* QR Scan Toggle (Mobile Only) */}
      {isMobile && !scanning && mode === 'private' && (
        <button className="scan-btn" onClick={() => setScanning(true)}>
          📷 Scan QR Code
        </button>
      )}

      {/* QR Scanner Live View */}
      {scanning && (
        <div className="qr-scanner">
          {streamError && <p style={{ color: 'red' }}>{streamError}</p>}
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
  );
};

export default WalletImportInline;
