import React, { useState, useEffect } from "react";
import { X, Menu, Sun, Moon } from "lucide-react";

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Check for dark mode on component mount
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode =
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(darkMode);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav
      className={`shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900"
          : "bg-gradient-to-r from-white via-gray-50 to-blue-50 border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3">
              <img
                src="/finallogo.png"
                alt="RVU Logo"
                className="h-10 w-10 object-contain"
              />
              <span
                className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                RVUConnect
              </span>
            </a>
          </div>

          {/* Navigation Links - Desktop - Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-6">
              <a
                href="/"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "text-white hover:bg-blue-700 hover:text-yellow-300"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                Home
              </a>
              <a
                href="/events"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                Events
              </a>
              <a
                href="/clubs"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                Clubs
              </a>
              <a
                href="/profile"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                Profile
              </a>
            </div>
          </div>

          {/* Theme Toggle - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={handleThemeToggle}
              className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 border ${
                isDarkMode
                  ? "bg-white/10 backdrop-blur-sm border-white/20 text-yellow-400 hover:bg-white/20 hover:text-yellow-300 focus:ring-yellow-400"
                  : "bg-gray-50 border-gray-200 text-blue-600 hover:bg-gray-100 hover:text-blue-700 focus:ring-blue-500"
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                isDarkMode
                  ? "bg-yellow-500 hover:bg-yellow-600 text-blue-900"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Login
            </a>
            <a
              href="/signup"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                isDarkMode
                  ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900"
                  : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
            >
              Sign Up
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`focus:outline-none transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:text-white focus:text-white"
                  : "text-gray-600 hover:text-gray-800 focus:text-gray-800"
              }`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden transition-all duration-300 ${
            isDarkMode
              ? "bg-blue-800 border-t border-blue-700"
              : "bg-white border-t border-gray-200 shadow-lg"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isDarkMode
                  ? "text-white hover:bg-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Home
            </a>
            <a
              href="/events"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              Events
            </a>
            <a
              href="/clubs"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              Clubs
            </a>
            <a
              href="/profile"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              Profile
            </a>

            {/* Mobile Theme Toggle */}
            <div className="px-3 py-2">
              <button
                onClick={handleThemeToggle}
                className={`w-full flex items-center justify-center p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 border ${
                  isDarkMode
                    ? "bg-white/10 backdrop-blur-sm border-white/20 text-yellow-400 hover:bg-white/20 hover:text-yellow-300 focus:ring-yellow-400"
                    : "bg-gray-50 border-gray-200 text-blue-600 hover:bg-gray-100 hover:text-blue-700 focus:ring-blue-500"
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="px-3 py-2 space-y-2">
              <a
                href="/login"
                className={`block text-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDarkMode
                    ? "bg-yellow-500 hover:bg-yellow-600 text-blue-900"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Login
              </a>
              <a
                href="/signup"
                className={`block text-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  isDarkMode
                    ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900"
                    : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
