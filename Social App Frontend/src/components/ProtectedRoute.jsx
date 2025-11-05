import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Consider both sessionStorage user object and a persistent flag in localStorage
  const hasSessionUser = !!sessionStorage.getItem("user");
  const isFlagged = localStorage.getItem("isAuthenticated") === "true";

  if (!hasSessionUser && !isFlagged) {
    // redirect to signup (or login) when unauthenticated; preserve attempted URL in state
    return <Navigate to="/signup" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
