import React from 'react';
import { Navigate } from 'react-router-dom';

// Security component to handle authentication check before rendering protected routes
const Security = ({ children }) => {
  const token = localStorage.getItem('token');
  
  return token ? children : <Navigate to="/" replace />;
};

export default Security;
