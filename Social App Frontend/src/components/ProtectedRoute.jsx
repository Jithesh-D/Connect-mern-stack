import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("user");

  if (!isAuthenticated) {
    return <Navigate to="/signup" />;
  }

  return children;
};

export default ProtectedRoute;
