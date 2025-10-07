import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../store/darkModeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow transition-all duration-300 hover:scale-105"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <>
          <Sun className="w-5 h-5" />
          <span className="hidden sm:block">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5" />
          <span className="hidden sm:block">Dark</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
