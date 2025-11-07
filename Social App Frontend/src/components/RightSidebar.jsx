import React from "react";
import { useDarkMode } from "../store/darkModeContext";
import { useSidebar } from "../store/sidebarContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Bot, Link, ArrowRight } from "lucide-react";

const RightSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();
  const { rightSidebarVisible } = useSidebar();

  const menuItems = [
    {
      path: "https://keys-vault-rvu.vercel.app/",
      icon: Link,
      label: "KEY-VAULT",
      type: "external",
    },
    // { path: "/chatbot", icon: Bot, label: "RVU Assistant", type: "internal" },
  ];

  const handleNavigation = (item) => {
    if (item.type === "external") {
      window.open(item.path, "_blank");
    } else {
      navigate(item.path);
    }
  };

  if (!rightSidebarVisible) {
    return null;
  }

  return (
    <aside
      className={`hidden lg:block w-74 sticky top-16 self-start transition-all duration-300 ${
        rightSidebarVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-4"
      }`}
      style={{ maxHeight: "calc(100vh - 4rem)" }}
    >
      <div className="overflow-y-auto h-full">
        <div
          className={`w-full h-full transition-all duration-300 ease-in-out border-l shadow-lg ${
            isDarkMode
              ? "bg-gradient-to-b from-gray-800 via-gray-900 to-black border-gray-700"
              : "bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-center mb-6">
              <span
                className={`text-xl font-bold transition-opacity duration-200 ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Quick Access
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
                const isActive =
                  item.type === "internal" && location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item)}
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
                    {item.type === "external" && (
                      <svg
                        className="ml-auto h-4 w-4 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Key Vault Info Box */}
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
                🔐 Key Vault
              </h3>
              <p
                className={`text-xs leading-relaxed mb-3 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Key Vault where you can find college related important links to
                access (eg: Placement Portal, Library, Academic Resources, etc.)
              </p>

              {/* Updated Go to Vault Button */}
              <button
                onClick={() =>
                  window.open("https://keys-vault-rvu.vercel.app/", "_blank")
                }
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-full transition-all duration-200"
              >
                Go to Vault
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
