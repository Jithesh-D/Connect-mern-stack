import React from "react";
import {
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Award,
  ListChecks,
} from "lucide-react";
// Assuming the path to your context is this, based on your previous code
import { useDarkMode } from "../store/darkModeContext";

// Main component
export default function PlacementDashboard() {
  // Get dark mode state from context
  const { isDarkMode } = useDarkMode();

  // Data arrays
  const companies = [
    "NTT Data",
    "Adapt Ready",
    "Infosys",
    "MSG Global",
    "Clari5/Perfios",
    "Commscope",
    "Progress",
    "ShareFile",
    "PhonePe",
    "EcoLabs",
    "Arctic Wolf Networks",
    "DRDO",
    "Thomson Reuters",
    "Cisco",
    "Societe Generale",
    "Black Box",
    "Toprankers",
    "Adyayam Education",
  ];

  const stats = [
    {
      icon: Users,
      label: "Total Students",
      value: "198",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Briefcase,
      label: "Companies Visited",
      value: "23",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: TrendingUp,
      label: "Internship Offers",
      value: "20",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Award,
      label: "Placement Offers",
      value: "19",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const highlights = [
    {
      label: "Highest Salary",
      value: "₹22.50 LPA",
      subtext: "Arctic Wolf Networks",
    },
    {
      label: "Highest Stipend",
      value: "₹60,000/month",
      subtext: "Arctic Wolf Networks & PhonePe",
    },
    {
      label: "Average Stipend",
      value: "₹40,000/month",
      subtext: "Internship Average",
    },
  ];

  const achievements = [
    "Top-tier companies including PhonePe, Arctic Wolf Networks, and Thomson Reuters",
    "Diverse opportunities in Product and Service-based companies",
    "Both Internship-only and Full-time placement opportunities",
    "Multiple offers from renowned organizations like DRDO and Cisco",
  ];

  const doubledCompanies = [...companies, ...companies];

  return (
    <div
      className={`min-h-screen font-inter ${
        isDarkMode ? "bg-black text-gray-400" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Internship & Placement Summary
          </h1>
          <p
            className={`text-lg md:text-xl ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            B.Tech 2022 Batch - School of Computer Science & Engineering
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 flex items-center space-x-4 transition-all duration-300 ${
                isDarkMode
                  ? "bg-black" // In dark mode, card is black (no shadow)
                  : "bg-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor}`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {stat.label}
                </p>
                {/* Per image, stat value is also gray in dark mode */}
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Highlights Section */}
        <div
          className={`rounded-2xl p-8 mb-12 ${
            isDarkMode ? "bg-black" : "bg-white shadow-lg"
          }`}
        >
          <div className="flex items-center mb-6">
            <Award className="w-8 h-8 text-yellow-500 mr-3" />
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Placement Highlights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 transition-all duration-300 ${
                  isDarkMode
                    ? "bg-black border border-gray-800" // Dark mode has borders
                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                }`}
              >
                <p
                  className={`text-sm mb-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {highlight.label}
                </p>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {highlight.value}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {highlight.subtext}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info / Key Achievements */}
        <div
          className={`rounded-2xl p-8 mb-12 ${
            isDarkMode ? "bg-black" : "bg-white shadow-lg"
          }`}
        >
          <h3
            className={`text-2xl font-semibold mb-6 text-center ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Key Achievements
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl mx-auto">
            {achievements.map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <ListChecks className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <a
            href="https://sites.google.com/rvu.edu.in/socseplacementportal/home"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Visit Placement Portal
          </a>
        </div>
      </div>

      {/* Moving Companies Ticker */}
      <div
        className={`py-6 overflow-hidden ${
          isDarkMode
            ? "bg-black border-t border-gray-800"
            : "bg-white border-t border-gray-200"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3
              className={`text-sm font-semibold uppercase tracking-wider ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Companies Visited
            </h3>
          </div>
        </div>
        <div className="relative flex overflow-hidden group">
          <div className="flex animate-scroll whitespace-nowrap group-hover:[animation-play-state:paused]">
            {doubledCompanies.map((company, index) => (
              <span
                key={index}
                className={`inline-block mx-8 text-xl font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-500 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
