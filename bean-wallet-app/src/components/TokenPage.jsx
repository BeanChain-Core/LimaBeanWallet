import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TokenPage = () => {
  const { tokenHash } = useParams();  
  const navigate = useNavigate();

  return (
    <div className="token-page">
      <h2>Token Details</h2>
      <p><strong>Token Hash:</strong> {tokenHash}</p>

      {/* Later: display token info here */}

      {/* <button onClick={() => navigate(`/send-token/${tokenHash}`)}>
        Send This Token
      </button> */}
    </div>
  );
};

export default TokenPage;