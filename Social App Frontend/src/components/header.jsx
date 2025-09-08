import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle.jsx";
import ThemeToggle from "./themeToggle.jsx";
import {
  Search,
  Menu,
  X,
  Home,
  PlusCircle,
  Calendar,
  Briefcase,
  User,
  GraduationCap,
} from "lucide-react";

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-yellow-400" />
              <span className="text-white text-xl font-bold">
                CampusConnect
              </span>
            </a>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              <a
                href="/"
                className="text-white hover:bg-blue-700 hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/profile"
                className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Profile
              </a>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Search campus..."
                />
              </div>
            </form>
          </div>

          {/* Theme Toggle - Desktop */}
          <div className="hidden md:block mx-4">
            <DarkModeToggle />
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Login
            </a>
            <a
              href="/signup"
              className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Sign Up
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
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
        <div className="md:hidden bg-blue-800 border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </a>
            <a
              href="/profile"
              className="text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Profile
            </a>

            {/* Mobile Search */}
            <div className="px-3 py-2">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Search campus..."
                  />
                </div>
              </form>
            </div>

            {/* Mobile Theme Toggle */}
            <div className="px-3 py-2">
              <button
                onClick={ThemeToggle}
                className="w-full flex items-center justify-center p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-yellow-400 hover:bg-white/20 hover:text-yellow-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 block text-center px-4 py-2 rounded-lg text-sm font-medium"
              >
                Login
              </a>
              <a
                href="/signup"
                className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 block text-center px-4 py-2 rounded-lg text-sm font-medium"
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
