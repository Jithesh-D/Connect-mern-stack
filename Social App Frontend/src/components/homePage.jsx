import {
  PlusSquare,
  Calendar,
  Briefcase,
  Home,
  GitPullRequest as GoMarkGithub,
} from "lucide-react";

import { useDarkMode } from "../store/darkModeContext";
import { NavLink } from "react-router-dom";
import PostList from "./postList";

export default function Homepage() {
  const { isDarkMode } = useDarkMode();

  const baseItem =
    "flex flex-col items-center p-2 transition-transform duration-150 no-underline";

  const activeClass = "text-white scale-110";
  const inactiveClass = isDarkMode
    ? "text-white/80 hover:scale-105"
    : "text-gray-700 hover:scale-105";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MAIN CONTENT */}
      <main className="flex-1 w-full flex justify-center items-start">
        <div className="w-full max-w-xl px-4 py-6">
          <PostList />
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex justify-around py-2 transition-colors duration-200 ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Home className="w-6 h-6" />
          <span className="text-xs no-underline">Home</span>
        </NavLink>

        <NavLink
          to="/create-post"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <PlusSquare className="w-6 h-6" />
          <span className="text-xs no-underline">Post</span>
        </NavLink>

        <NavLink
          to="/contribution"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <GoMarkGithub className="w-6 h-6" />
          <span className="text-xs no-underline">Collab Hub</span>
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs no-underline">Events</span>
        </NavLink>

        <NavLink
          to="/placements"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <Briefcase className="w-6 h-6" />
          <span className="text-xs no-underline">Placements</span>
        </NavLink>
      </nav>
    </div>
  );
}
