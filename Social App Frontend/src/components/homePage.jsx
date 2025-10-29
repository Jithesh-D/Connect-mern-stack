import {
  PlusSquare,
  Calendar,
  Briefcase,
  Home,
  Bot,
  Users,
  Link as LinkIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import PostList from "./postList";

export default function Homepage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MAIN CONTENT */}
      <main className="flex-1 w-full sm:max-w-2xl sm:mx-auto sm:p-4 p-0 pb-24">
        <PostList />
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden lg:block w-80 bg-white shadow-lg p-4 overflow-y-auto">
        {/* Quick Links Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">M</h2>
          <div className="space-y-2">
            <NavLink
              to="/chatbot"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? "bg-black-100 text-black-600" : "hover:bg-gray-100"
                }`
              }
            >
              <Bot className="w-5 h-5" />
              <span className="font-medium">RVU Assistant</span>
            </NavLink>

            <NavLink
              to="/community"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? "bg-black-100 text-black-600" : "hover:bg-gray-100"
                }`
              }
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Community</span>
            </NavLink>

            <NavLink
              to="/key-links"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? "bg-black-100 text-black-600" : "hover:bg-gray-100"
                }`
              }
            >
              <LinkIcon className="w-5 h-5" />
              <span className="font-medium">Key Links</span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t flex justify-around py-2 z-50">
        {/* Home */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
            }`
          }
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </NavLink>

        {/* Post */}
        <NavLink
          to="/create-post"
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
            }`
          }
        >
          <PlusSquare className="w-6 h-6" />
          <span className="text-xs">Post</span>
        </NavLink>

        {/* Assistant (Bot) */}
        <NavLink
          to="/chatbot"
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
            }`
          }
        >
          <Bot className="w-6 h-6" />
          <span className="text-xs">Assistant</span>
        </NavLink>

        {/* Events */}
        <NavLink
          to="/events"
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
            }`
          }
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs">Events</span>
        </NavLink>

        {/* Placements */}
        <NavLink
          to="/placements"
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
            }`
          }
        >
          <Briefcase className="w-6 h-6" />
          <span className="text-xs">Placements</span>
        </NavLink>
      </nav>
    </div>
  );
}
