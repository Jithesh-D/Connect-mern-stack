import React from "react";
import { useDarkMode } from "../store/darkModeContext";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const Contribution = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/add-contribution");
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className={`text-3xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Collab Hub
            </h1>
            <h6
              className={`text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Section to add your ideas & projects that others and yourself can
              work on
            </h6>
          </div>
          <button
            onClick={handleAddClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:from-blue-700 hover:to-purple-800 shadow-lg shadow-blue-500/20"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md"
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            Add Idea or Project
          </button>
        </div>

        {/* Content Area */}
        <div
          className={`mt-8 p-8 rounded-xl border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No contributions yet. Be the first to add your idea or project!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contribution;
