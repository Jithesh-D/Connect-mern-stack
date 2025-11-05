import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Chatbot from "./components/chatBot"; // ADD THIS IMPORT

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem("user");
  });
  const location = useLocation();

  // On app mount, try to fetch current user and persist to sessionStorage so profile info is available
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            try {
              sessionStorage.setItem(
                "user",
                JSON.stringify({
                  id: data.user.id,
                  username: data.user.username,
                  profileImage: data.user.profileImage || null,
                })
              );
              setIsAuthenticated(true);
            } catch (e) {}
          }
        }
      } catch (e) {
        // ignore network errors here
      }
    };
    fetchUser();

    // listen for manual auth changes (login/signup pages will dispatch this event)
    const onUserChanged = () => {
      setIsAuthenticated(!!sessionStorage.getItem("user"));
    };
    window.addEventListener("userChanged", onUserChanged);

    return () => window.removeEventListener("userChanged", onUserChanged);
  }, []);

  // Redirect unauthenticated users to signup, except for login/signup pages
  if (!isAuthenticated && !["/login", "/signup"].includes(location.pathname)) {
    return <Navigate to="/signup" />;
  }

  const hideChatOn = ["/login", "/signup"];

  return (
    <div className="app-container min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-200">
      <Outlet />
      {isAuthenticated && !hideChatOn.includes(location.pathname) && (
        <div className="fixed bottom-4 right-4 z-50">
          <Chatbot /> {/* floating chatbot visible only on main app pages */}
        </div>
      )}
    </div>
  );
}

export default App;
