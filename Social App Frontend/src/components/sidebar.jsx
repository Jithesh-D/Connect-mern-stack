import React, { useState, useEffect } from "react";
import { useDarkMode } from "../store/darkModeContext";
import { useSidebar } from "../store/sidebarContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Calendar,
  Briefcase,
  GitPullRequest,
} from "lucide-react";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();
  const { leftSidebarMenuVisible, hideRightSidebar, resetSidebars } =
    useSidebar();
  const [stats, setStats] = useState({
    posts: 0,
    events: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { path: "/", icon: Home, label: "Home", type: "internal" },
    {
      path: "/create-Post",
      icon: PlusCircle,
      label: "Create Post",
      type: "internal",
    },
    { path: "/events", icon: Calendar, label: "Events", type: "internal" },
    {
      path: "/contribution",
      icon: GitPullRequest,
      label: "Collab Hub",
      type: "internal",
    },
    {
      path: "/placements",
      icon: Briefcase,
      label: "Placements",
      type: "internal",
    },
  ];

  const handleNavigation = (item) => {
    if (item.label === "Home") {
      resetSidebars();
    } else {
      hideRightSidebar();
    }

    if (item.type === "external") {
      window.open(item.path, "_blank");
    } else {
      navigate(item.path);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [postsRes, eventsRes, projectsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/posts`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/events`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/contributions`),
      ]);

      setStats({
        posts: postsRes.data.length || 0,
        events: eventsRes.data.length || 0,
        projects: projectsRes.data.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div
      className={`w-full h-full transition-all duration-300 ease-in-out border-r shadow-lg ${
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
            const isActive =
              item.type === "internal" && location.pathname === item.path;
            const isHomeItem = item.label === "Home";
            const shouldShow = leftSidebarMenuVisible || isHomeItem;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 group ${
                  shouldShow
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4 pointer-events-none"
                } ${
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
                {loading ? "..." : stats.posts}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Events</span>
              <span
                className={`font-medium ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                {loading ? "..." : stats.events}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Open-Projects</span>
              <span
                className={`font-medium ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {loading ? "..." : stats.projects}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
