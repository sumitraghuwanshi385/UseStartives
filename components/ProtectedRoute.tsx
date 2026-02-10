// FIX: Resolved "Cannot find namespace 'JSX'" error by importing React, which is necessary for using JSX types like `JSX.Element`.
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface ProtectedRouteProps {
  // FIX: Changed children prop type from JSX.Element to React.ReactNode for better type safety and consistency.
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isLoading, token } = useAppContext();
  const location = useLocation();

  if (isLoading) {
    // Return null to allow the FullScreenLoader in App.tsx to be the single source of truth for loading state.
    return null;
  }
  
  // Check token first, then currentUser to ensure persistence check is complete
  if (!token && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;