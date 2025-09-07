import { PlusSquare, Calendar, Briefcase, Home } from "lucide-react";
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
      <aside className="hidden lg:block w-80 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Trending</h2>
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition">
            🚀 RVU Hackathon starts in 2 days!
          </div>
          <div className="p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition">
            💼 Infosys placed 20 students this week!
          </div>
          <div className="p-3 bg-pink-50 rounded-lg cursor-pointer hover:bg-pink-100 transition">
            🎉 RVU Cultural Fest announced!
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
