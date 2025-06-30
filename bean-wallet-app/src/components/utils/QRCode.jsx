import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { IS_GHOSTNET } from '../../config.js';
import '../dashboard/Dashboard.css';

const QRCode = ({ data }) => {
  const qrRef = useRef(null);
  const cleanData = (data || '').trim().replace(/\s+/g, '');
  const logoPath = IS_GHOSTNET ? "/GhostBean.png" : "/RegBean.png";

  const qrCode = new QRCodeStyling({
    width: 256,
    height: 256,
    margin: 10,
    data: cleanData,
    image: logoPath,
    dotsOptions: {
      color: IS_GHOSTNET ? "#B38DFF" : "#000000",
      type: "rounded" // options: 'dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded'
    },
    backgroundOptions: {
      color: IS_GHOSTNET ? "#1E002B" : "#00D33C"
    },
    cornersSquareOptions: {
      color: IS_GHOSTNET ? "#B38DFF" : "#000000",
      type: "dot" // options: 'square', 'dot', 'extra-rounded'
    },
    cornersDotOptions: {
      color: IS_GHOSTNET ? "#B38DFF" : "#000000",
      type: "dot" // 'dot' or 'square'
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 8
    }
  });

  useEffect(() => {
    qrCode.append(qrRef.current);
    qrCode.update({ data: cleanData });
  }, [cleanData]);

  const downloadQR = () => {
    qrCode.download({ name: IS_GHOSTNET ? "ghost-wallet-qr" : "bean-wallet-qr", extension: "png" });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div ref={qrRef} />
      <p style={{ wordBreak: 'break-all' }}>{cleanData}</p>
      <div className="send-action">
        <button onClick={downloadQR}>📥 Download QR</button>
      </div>
    </div>
  );
};

export default QRCode;

