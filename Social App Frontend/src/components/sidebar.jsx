import React from "react";
import { useDarkMode } from "../store/darkModeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, PlusCircle, Calendar, Briefcase, Bot } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  const menuItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/create-Post", icon: PlusCircle, label: "Create Post" },
    { path: "/events", icon: Calendar, label: "Events" },
    { path: "/placements", icon: Briefcase, label: "Placements" },
    { path: "/chatbot", icon: Bot, label: "RVU Assistant" },
  ];

  return (
    <div
      className={`w-64 transition-all duration-300 ease-in-out border-r shadow-lg ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-800 via-gray-900 to-black border-gray-700"
          : "bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200"
      }`}
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="p-6">
        <div className="flex items-center justify-center mb-6">
          <span
            className={`text-xl font-bold transition-opacity duration-200 ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Menu
          </span>
        </div>

        <div
          className={`h-px mb-6 ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-400/30 to-purple-400/30"
              : "bg-gradient-to-r from-blue-200 to-purple-200"
          }`}
        ></div>

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
                }`}
              >
                <Icon
                  className={`h-5 w-5 mr-3 ${
                    isActive
                      ? "text-white"
                      : isDarkMode
                      ? "text-gray-400 group-hover:text-blue-400"
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}
                />
                <span className="font-medium transition-opacity duration-200">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Quick Stats Card */}
        <div
          className={`mt-8 p-4 rounded-lg border transition-all duration-200 ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/50 backdrop-blur-sm"
              : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100"
          }`}
        >
          <h3
            className={`text-sm font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-700"
            }`}
          >
            Quick Stats
          </h3>
          <div
            className={`space-y-1 text-xs ${
              isDarkMode ? "text-white" : "text-gray-600"
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
              <span>Highest Package</span>
              <span
                className={`font-medium ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                22.5 LPA
              </span>
            </div>
          </div>
        </div>
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
