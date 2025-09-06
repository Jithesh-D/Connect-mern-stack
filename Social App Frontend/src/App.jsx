import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Outlet, Navigate } from "react-router-dom";

function App() {
  const isAuthenticated = sessionStorage.getItem("user");

  if (!isAuthenticated && window.location.pathname === "/") {
    return <Navigate to="/signup" />;
  }

  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
}

export default App;
