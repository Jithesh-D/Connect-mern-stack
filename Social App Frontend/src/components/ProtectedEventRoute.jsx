import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedEventRoute = ({ children }) => {
  const token = localStorage.getItem('eventToken');
  
  if (!token) {
    return <Navigate to="/event-login" replace />;
  }

  return children;
};

export default ProtectedEventRoute;