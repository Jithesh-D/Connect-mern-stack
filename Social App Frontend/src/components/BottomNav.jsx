import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  PlusSquare,
  Calendar,
  Briefcase,
  GitPullRequest,
} from "lucide-react";
import { useDarkMode } from "../store/darkModeContext";

export default function BottomNav() {
  const { isDarkMode } = useDarkMode();

  const baseItem = `flex flex-col items-center justify-center p-2 w-full transition-transform duration-150 no-underline`;

  // We'll compute classes per-link so we can handle light/dark + active background for visibility

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex justify-around py-2 ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
      aria-label="bottom navigation"
    >
      <NavLink
        to="/home"
        className={({ isActive }) => {
          if (isActive) {
            return `${baseItem} text-white scale-110 ${
              isDarkMode ? "" : "bg-blue-600 rounded-md px-3 py-2"
            }`;
          }
          return `${baseItem} ${
            isDarkMode
              ? "text-white/80 hover:scale-105"
              : "text-gray-700 hover:scale-105"
          }`;
        }}
      >
        <Home className="w-6 h-6" />
        <span className="text-xs no-underline">Home</span>
      </NavLink>

      <NavLink
        to="/create-post"
        className={({ isActive }) => {
          if (isActive) {
            return `${baseItem} text-white scale-110 ${
              isDarkMode ? "" : "bg-blue-600 rounded-md px-3 py-2"
            }`;
          }
          return `${baseItem} ${
            isDarkMode
              ? "text-white/80 hover:scale-105"
              : "text-gray-700 hover:scale-105"
          }`;
        }}
      >
        <PlusSquare className="w-6 h-6" />
        <span className="text-xs no-underline">Post</span>
      </NavLink>

      <NavLink
        to="/contribution"
        className={({ isActive }) => {
          if (isActive) {
            return `${baseItem} text-white scale-110 ${
              isDarkMode ? "" : "bg-blue-600 rounded-md px-3 py-2"
            }`;
          }
          return `${baseItem} ${
            isDarkMode
              ? "text-white/80 hover:scale-105"
              : "text-gray-700 hover:scale-105"
          }`;
        }}
      >
        <GitPullRequest className="w-6 h-6" />
        <span className="text-xs no-underline">Collab Hub</span>
      </NavLink>

      <NavLink
        to="/events"
        className={({ isActive }) => {
          if (isActive) {
            return `${baseItem} text-white scale-110 ${
              isDarkMode ? "" : "bg-blue-600 rounded-md px-3 py-2"
            }`;
          }
          return `${baseItem} ${
            isDarkMode
              ? "text-white/80 hover:scale-105"
              : "text-gray-700 hover:scale-105"
          }`;
        }}
      >
        <Calendar className="w-6 h-6" />
        <span className="text-xs no-underline">Events</span>
      </NavLink>

      <NavLink
        to="/placements"
        className={({ isActive }) => {
          if (isActive) {
            return `${baseItem} text-white scale-110 ${
              isDarkMode ? "" : "bg-blue-600 rounded-md px-3 py-2"
            }`;
          }
          return `${baseItem} ${
            isDarkMode
              ? "text-white/80 hover:scale-105"
              : "text-gray-700 hover:scale-105"
          }`;
        }}
      >
        <Briefcase className="w-6 h-6" />
        <span className="text-xs no-underline">Placements</span>
      </NavLink>
    </nav>
  );
}
