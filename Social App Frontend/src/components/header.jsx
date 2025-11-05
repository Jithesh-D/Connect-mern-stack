import React, { useState, useEffect } from "react";
import {
  X,
  Menu,
  Sun,
  Moon,
  Key,
  Bot,
  Users,
  User,
  Home,
  LogOut,
  GitPullRequest as Github,
} from "lucide-react";
import { useDarkMode } from "../store/darkModeContext";
import { useNavigate } from "react-router-dom";

// Words for the animation effect
const animatedWords = [
  "Connect",
  "Events",
  "Clubs",
  "Network",
  "Unite",
  "Discover",
];

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  // State to track the current word for the animation
  const [wordIndex, setWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Effect to cycle through the words every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setWordIndex((prevIndex) => (prevIndex + 1) % animatedWords.length);
        setIsVisible(true);
      }, 250);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
            <a href="/" className="flex items-center">
              <img
                src="/finallogo.png"
                alt="RVU Logo"
                className="h-10 w-10 object-contain mr-2"
              />
              <span
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                RVU
              </span>

              {/* Animated text box */}
              <div
                className={`relative flex items-center justify-center h-8 w-28 ml-1.5 px-3 rounded-md overflow-hidden transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-800" : "bg-blue-600"
                }`}
              >
                <span
                  className={`text-lg font-bold text-white transition-all duration-500 ease-in-out ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  }`}
                >
                  {animatedWords[wordIndex]}
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-6">
              <button
                onClick={() => navigate("/")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "text-white hover:bg-blue-700 hover:text-yellow-300"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/events")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                Events
              </button>
              <button
                onClick={() => navigate("/clubs")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                Clubs
              </button>
              <button
                onClick={() => navigate("/profile")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                Profile
              </button>
            </div>
          </div>

          {/* Right Side - Theme Toggle & Logout - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={toggleDarkMode}
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
            <div className="ml-2">
              <button
                onClick={() => {
                  sessionStorage.removeItem("user");
                  localStorage.removeItem("userEmail");
                  try {
                    localStorage.removeItem("isAuthenticated");
                  } catch (e) {}
                  // After logout, redirect users to signup page
                  navigate("/signup");
                }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                  isDarkMode
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleDarkMode}
              className={`p-2 mr-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 border ${
                isDarkMode
                  ? "bg-white/10 border-white/20 text-yellow-400"
                  : "bg-gray-50 border-gray-200 text-blue-600"
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`focus:outline-none transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-800"
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

      {/* Mobile Menu - Slide Down Animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } ${isDarkMode ? "bg-blue-800" : "bg-white border-t border-gray-200"}`}
      >
        <div className="px-4 pt-3 pb-4 space-y-2">
          <button
            onClick={() => {
              window.open("https://keys-vault-rvu.vercel.app/", "_blank");
              setIsMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-base font-medium ${
              isDarkMode
                ? "text-white hover:bg-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Key className="h-5 w-5" />
            Key Vault
          </button>

          <button
            onClick={() => {
              navigate("/chatbot");
              setIsMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-base font-medium ${
              isDarkMode
                ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <Bot className="h-5 w-5" />
            RVU Assistant
          </button>

          <button
            onClick={() => {
              navigate("/clubs");
              setIsMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-base font-medium ${
              isDarkMode
                ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <Users className="h-5 w-5" />
            Clubs
          </button>

          <button
            onClick={() => {
              navigate("/profile");
              setIsMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-base font-medium ${
              isDarkMode
                ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <User className="h-5 w-5" />
            Profile
          </button>

          {/* Collab Hub Button with GitHub Logo */}
          <button
            onClick={() => {
              navigate("/collabhub");
              setIsMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-base font-medium ${
              isDarkMode
                ? "text-gray-300 hover:bg-blue-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <Github className="h-5 w-5" />
            Collab Hub
          </button>

          <div
            className={`border-t pt-4 mt-3 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              onClick={() => {
                sessionStorage.removeItem("user");
                localStorage.removeItem("userEmail");
                try {
                  localStorage.removeItem("isAuthenticated");
                } catch (e) {}
                // After logout on mobile, redirect to signup page
                navigate("/signup");
                setIsMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDarkMode
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
