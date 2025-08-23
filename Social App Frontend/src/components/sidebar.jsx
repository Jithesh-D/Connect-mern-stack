import React, { useState } from "react";
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
  GraduationCap,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/create-Post", icon: PlusCircle, label: "Create Post" },
    { path: "/events", icon: Calendar, label: "Events" },
    { path: "/placements", icon: Briefcase, label: "Placements" },
  ];

  return (
    <div
      className="bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 shadow-lg"
      style={{ width: "250px", minHeight: "calc(100vh - 64px)" }}
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Menu className="h-6 w-6 text-blue-600 mr-3" />
          <span className="text-xl font-bold text-gray-800">Menu</span>
        </div>

        <div className="h-px bg-gradient-to-r from-blue-200 to-purple-200 mb-6"></div>

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
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
                }`}
              >
                <Icon
                  className={`h-5 w-5 mr-3 ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Stats Card */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Quick Stats
          </h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Active Posts</span>
              <span className="font-medium text-blue-600">24</span>
            </div>
            <div className="flex justify-between">
              <span>Upcoming Events</span>
              <span className="font-medium text-purple-600">8</span>
            </div>
            <div className="flex justify-between">
              <span>Job Openings</span>
              <span className="font-medium text-green-600">15</span>
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
