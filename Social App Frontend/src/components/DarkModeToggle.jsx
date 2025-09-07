import React from "react";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../store/darkModeContext";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full text-gray-300 hover:bg-blue-700 hover:text-yellow-300 transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Moon className="h-5 w-5 fill-current" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
};

export default DarkModeToggle;
