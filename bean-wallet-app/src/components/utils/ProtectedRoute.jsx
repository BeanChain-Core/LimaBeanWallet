import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isAuthed, rehydrated, children }) => {
  const location = useLocation();

  if (!rehydrated) {
    return (
      <p style={{ textAlign: 'center', marginTop: '2rem' }}>
        Restoring your wallet...
      </p>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
