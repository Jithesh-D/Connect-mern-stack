import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <GraduationCap className="h-8 w-8 text-yellow-400 mr-2" />
                <span className="text-2xl font-bold">CampusConnect</span>
              </div>
              <p className="text-gray-300 text-sm mb-4 max-w-md">
                Connecting students, faculty, and opportunities across campus.
                Your gateway to academic excellence and career success.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  📘
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  🐦
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  💼
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  📷
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/help"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">
                Features
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/events"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Campus Events
                  </a>
                </li>
                <li>
                  <a
                    href="/placements"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Job Placements
                  </a>
                </li>
                <li>
                  <a
                    href="/forums"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Discussion Forums
                  </a>
                </li>
                <li>
                  <a
                    href="/resources"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Study Resources
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} CampusConnect. All rights
                reserved.
              </p>
              <p className="text-gray-400 text-sm mt-2 md:mt-0">
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
