import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Chatbot from "./components/chatBot"; // ADD THIS IMPORT

function App() {
  const isAuthenticated = sessionStorage.getItem("user");

  if (!isAuthenticated && window.location.pathname === "/") {
    return <Navigate to="/signup" />;
  }

  return (
    <div className="app-container min-h-screen bg-white text-black dark:bg-dark dark:text-white transition-colors duration-200">
      <Outlet />
      {isAuthenticated && (
        <div className="fixed bottom-4 right-4 z-50">
          <Chatbot /> {/* REPLACE THE COMMENT WITH THIS */}
        </div>
      )}
    </div>
  );
}

export default App;
