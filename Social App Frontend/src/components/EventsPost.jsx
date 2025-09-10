import React, { useState, useEffect } from "react";

const EventsPost = ({ event, onImageUpload }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(event?.image || null);

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

  const {
    title,
    subtitle,
    description,
    date,
    time,
    venue,
    registrationLink,
    whatsappLink,
  } = event;

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // Pass the file back to parent if needed
      if (onImageUpload) {
        onImageUpload(file);
      }
    }
  };

  return (
    <div
      className={`max-w-md mx-auto shadow-xl rounded-2xl overflow-hidden border transition-all duration-300 mb-6 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:shadow-2xl hover:shadow-indigo-500/20"
          : "bg-white border-gray-200 hover:shadow-2xl"
      }`}
    >
      {/* Header */}
      <div
        className={`text-white text-center p-4 ${
          isDarkMode
            ? "bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700"
            : "bg-indigo-600"
        }`}
      >
        <h2 className="text-2xl font-bold drop-shadow-sm">{title}</h2>
        {subtitle && <h3 className="text-lg opacity-90 mt-1">{subtitle}</h3>}
      </div>

      {/* Event Image */}
      <div className="relative w-full h-52 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Event"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No image uploaded
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="p-4 flex flex-col items-center space-y-2">
        <label
          htmlFor="imageUpload"
          className={`cursor-pointer py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            isDarkMode
              ? "bg-indigo-600 hover:bg-indigo-500 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {selectedImage ? "Change Event Image" : "Upload Event Image"}
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <p
          className={`leading-relaxed ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {description}
        </p>

        {/* Date & Time */}
        <div
          className={`flex justify-between items-center font-medium border-t pt-3 ${
            isDarkMode
              ? "text-gray-200 border-gray-700"
              : "text-gray-800 border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">📅</span>
            <span className="text-sm sm:text-base">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">⏰</span>
            <span className="text-sm sm:text-base">{time}</span>
          </div>
        </div>

        {/* Venue */}
        <div
          className={`flex items-center border-t pt-3 ${
            isDarkMode
              ? "text-gray-300 border-gray-700"
              : "text-gray-700 border-gray-200"
          }`}
        >
          <span className="text-lg mr-2">📍</span>
          <span className="flex-1">{venue}</span>
        </div>

        {/* Event Status Indicator */}
        <div
          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700/50 border-gray-600 text-gray-300"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isDarkMode ? "bg-green-400" : "bg-green-500"
            } animate-pulse`}
          ></div>
          <span className="text-sm font-medium">Registration Open</span>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`p-4 space-y-2 text-center ${
          isDarkMode
            ? "bg-gray-900/50 border-t border-gray-700"
            : "bg-gray-50 border-t border-gray-100"
        }`}
      >
        {registrationLink && (
          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
              isDarkMode
                ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>📝</span>
              <span>Register Now</span>
            </span>
          </a>
        )}

        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
              isDarkMode
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>💬</span>
              <span>Join WhatsApp Group</span>
            </span>
          </a>
        )}

        {/* Additional Info */}
        <div
          className={`text-xs mt-3 pt-2 border-t ${
            isDarkMode
              ? "text-gray-400 border-gray-700"
              : "text-gray-500 border-gray-200"
          }`}
        >
          <p>Click links above to register or get updates</p>
        </div>
      </div>

      {/* Decorative accent line */}
      <div
        className={`h-1 ${
          isDarkMode
            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"
            : "bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400"
        }`}
      ></div>
    </div>
  );
};

export default EventsPost;
