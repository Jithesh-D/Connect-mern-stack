import React from "react";
// For a professional UI, icons are a great addition.
// This example assumes you have 'lucide-react' installed.
// If not, you can run: npm install lucide-react
// Alternatively, you can use an inline SVG or another icon library.
import { WifiOff } from "lucide-react";

/**
 * A professional UI component to display a "No Internet Connection" message.
 * It's named WelcomeMessage to match the original file, but functions
 * as an error/status message.
 */
const WelcomeMessage = () => {
  /**
   * Handles the click event for the "Try Again" button
   * by reloading the page.
   */
  const handleTryAgain = () => {
    // A common action for "try again" on a connection error
    // is to reload the page.
    window.location.reload();
  };

  return (
    // Centering container
    <div className="flex items-center justify-center p-4 my-8 min-h-[300px]">
      {/* Card container for the message */}
      <div className="w-full max-w-sm p-8 text-center bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Icon */}
        <WifiOff
          className="w-16 h-16 mx-auto mb-4 text-red-500"
          strokeWidth={1.5}
        />

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Connection Error
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Please check your internet connection and try again.
        </p>

        {/* Action Button (from your original commented-out code) */}
        <button
          onClick={handleTryAgain}
          type="button"
          className="inline-flex items-center justify-center px-6 py-2.5 font-medium text-white bg-blue-600 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default WelcomeMessage;
