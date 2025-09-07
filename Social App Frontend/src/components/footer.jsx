import React from "react";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Brand and Description */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <GraduationCap className="h-6 w-6 text-yellow-400 mr-2" />
              <span className="text-xl font-bold">CampusConnect</span>
            </div>
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              Connecting students, faculty, and opportunities across campus.
            </p>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} CampusConnect. All rights
                reserved.
              </p>
              <p className="text-gray-400 mt-2 md:mt-0">
                Made with ❤️ for students, by students
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
