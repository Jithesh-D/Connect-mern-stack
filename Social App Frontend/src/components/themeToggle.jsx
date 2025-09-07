import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow transition-all duration-300 hover:scale-105"
    >
      {theme === "dark" ? (
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
