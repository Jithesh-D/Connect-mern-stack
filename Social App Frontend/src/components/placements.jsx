import { useEffect, useState } from "react";
import { useDarkMode } from "../store/darkModeContext"; // Adjust path as needed
import {
  ExternalLink,
  Briefcase,
  TrendingUp,
  Award,
  Sun,
  Moon,
} from "lucide-react";

const Placements = () => {
  const [countdown, setCountdown] = useState(3);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.open(
            "https://sites.google.com/rvu.edu.in/socseplacementportal/home",
            "_blank"
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`min-h-screen relative flex items-center justify-center p-6 transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 z-10 ${
          isDarkMode
            ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
            : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-md"
        }`}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      {/* Background image with overlay - only in dark mode */}
      {isDarkMode && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://i.ibb.co/YyFqLqH/image.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-indigo-900/95"></div>
        </div>
      )}

      <div className="relative max-w-4xl w-full">
        {/* Main card - Fixed background */}
        <div
          className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isDarkMode
              ? "bg-white/10 backdrop-blur-xl border border-white/20"
              : "bg-white border border-gray-200 shadow-xl"
          }`}
        >
          {/* Header section with gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 md:p-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Briefcase className="w-10 h-10 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Placement Portal
              </h1>
            </div>
            <p className="text-center text-indigo-100 text-lg">
              School of Computer Science and Engineering
            </p>
            <p className="text-center text-indigo-200 text-sm mt-2">
              RV University
            </p>
          </div>

          {/* Content section */}
          <div className="p-8 md:p-12">
            {/* Countdown or status */}
            {countdown > 0 ? (
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-xl mb-4">
                  <span className="text-4xl font-bold text-white">
                    {countdown}
                  </span>
                </div>
                <p
                  className={`text-lg font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Redirecting to placement portal...
                </p>
              </div>
            ) : (
              <div className="text-center mb-10">
                <div
                  className={`inline-flex items-center gap-3 font-semibold text-lg mb-2 ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      isDarkMode ? "bg-green-400" : "bg-green-600"
                    }`}
                  ></div>
                  Portal opened in new tab
                </div>
              </div>
            )}

            {/* Description */}
            <div className="text-center mb-10">
              <p
                className={`text-lg leading-relaxed max-w-2xl mx-auto ${
                  isDarkMode ? "text-white/90" : "text-gray-700"
                }`}
              >
                Access comprehensive placement and internship opportunities.
                Connect with top recruiters, view job postings, and manage your
                placement journey through our dedicated portal.
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center mb-10">
              <a
                href="https://sites.google.com/rvu.edu.in/socseplacementportal/home"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 font-semibold px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  isDarkMode
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700"
                }`}
              >
                <span className="text-lg">Access Placement Portal</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {/* Stats section */}
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 ${
                isDarkMode ? "border-white/20" : "border-gray-200"
              } border-t`}
            >
              <div className="text-center">
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-xl mb-3 mx-auto ${
                    isDarkMode ? "bg-indigo-500/20" : "bg-indigo-100"
                  }`}
                >
                  <Briefcase
                    className={`w-7 h-7 ${
                      isDarkMode ? "text-indigo-300" : "text-indigo-600"
                    }`}
                  />
                </div>
                <div
                  className={`text-3xl font-bold mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  500+
                </div>
                <div
                  className={isDarkMode ? "text-indigo-200" : "text-gray-600"}
                >
                  Partner Companies
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-xl mb-3 mx-auto ${
                    isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                  }`}
                >
                  <TrendingUp
                    className={`w-7 h-7 ${
                      isDarkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                </div>
                <div
                  className={`text-3xl font-bold mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  95%
                </div>
                <div className={isDarkMode ? "text-blue-200" : "text-gray-600"}>
                  Placement Rate
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-xl mb-3 mx-auto ${
                    isDarkMode ? "bg-purple-500/20" : "bg-purple-100"
                  }`}
                >
                  <Award
                    className={`w-7 h-7 ${
                      isDarkMode ? "text-purple-300" : "text-purple-600"
                    }`}
                  />
                </div>
                <div
                  className={`text-3xl font-bold mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  12 LPA
                </div>
                <div
                  className={isDarkMode ? "text-purple-200" : "text-gray-600"}
                >
                  Average Package
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div
              className={`mt-8 pt-6 text-center ${
                isDarkMode ? "border-white/10" : "border-gray-200"
              } border-t`}
            >
              <p
                className={`text-sm ${
                  isDarkMode ? "text-white/60" : "text-gray-500"
                }`}
              >
                If the portal didn't open automatically, please click the button
                above to access manually
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placements;
