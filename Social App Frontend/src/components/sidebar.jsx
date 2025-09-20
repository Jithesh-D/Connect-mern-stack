import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Home,
  PlusCircle,
  Calendar,
  Briefcase,
  User,
  Bot,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode on component mount
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode =
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(darkMode);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const menuItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/create-Post", icon: PlusCircle, label: "Create Post" },
    { path: "/events", icon: Calendar, label: "Events" },
    { path: "/placements", icon: Briefcase, label: "Placements" },
    { path: "/chatbot", icon: Bot, label: "RVU Assistant" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out border-r shadow-lg ${
        isCollapsed ? "w-16" : "w-64"
      } ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-800 via-gray-900 to-black border-gray-700"
          : "bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200"
      }`}
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={toggleSidebar}
            className={`h-6 w-6 mr-3 transition-colors duration-200 cursor-pointer ${
              isDarkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            {isCollapsed ? (
              <Menu className="h-6 w-6" />
            ) : (
              <X className="h-6 w-6" />
            )}
          </button>
          {!isCollapsed && (
            <span
              className={`text-xl font-bold transition-opacity duration-200 ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Menu
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div
            className={`h-px mb-6 ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-400/30 to-purple-400/30"
                : "bg-gradient-to-r from-blue-200 to-purple-200"
            }`}
          ></div>
        )}

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                  isActive
                    ? isDarkMode
                      ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg transform scale-105 shadow-blue-500/20"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-700/50 hover:text-blue-300 hover:shadow-sm"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon
                  className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"} ${
                    isActive
                      ? "text-white"
                      : isDarkMode
                      ? "text-gray-400 group-hover:text-blue-400"
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}
                />
                {!isCollapsed && (
                  <span className="font-medium transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Stats Card - only show when expanded */}
        {!isCollapsed && (
          <div
            className={`mt-8 p-4 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? "bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/50 backdrop-blur-sm"
                : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100"
            }`}
          >
            <h3
              className={`text-sm font-semibold mb-2 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Quick Stats
            </h3>
            <div
              className={`space-y-1 text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="flex justify-between">
                <span>Active Posts</span>
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  24
                </span>
              </div>
              <div className="flex justify-between">
                <span>Upcoming Events</span>
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  8
                </span>
              </div>
              <div className="flex justify-between">
                <span>Job Openings</span>
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  15
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
{
  /* ${ selectedTab === "CreatePost"
 ? "active bg-dark text-white"
 : "text-dark"}` */
}

/*{${selectedTab === "Home" ? "active bg-dark text-white" : "text-dark"}} */
