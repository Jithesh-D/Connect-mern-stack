import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated by checking session storage or context
  const isAuthenticated = sessionStorage.getItem("user");

  if (!isAuthenticated) {
    // Redirect to signup if not authenticated
    return <Navigate to="/signup" />;
  }

  return children;
};

export default ProtectedRoute;
