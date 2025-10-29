import React from "react";
import { TrendingUp, Users, Briefcase, DollarSign, Award } from "lucide-react";
import { useDarkMode } from "../store/darkModeContext";

export default function PlacementDashboard() {
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
      color: "bg-blue-500",
    },
    {
      icon: Briefcase,
      label: "Companies Visited",
      value: "23",
      color: "bg-purple-500",
    },
    {
      icon: TrendingUp,
      label: "Internship Offers",
      value: "20",
      color: "bg-green-500",
    },
    {
      icon: Award,
      label: "Placement Offers",
      value: "19",
      color: "bg-orange-500",
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
      label: "Average Salary",
      value: "₹40,000/month",
      subtext: "Internship Average",
    },
  ];

  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-black-900 to-slate-900 text-white"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Internship & Placement Summary
          </h1>
          <p className="text-xl text-gray-300">
            B.Tech 2022 Batch - School of Computer Science & Engineering
          </p>
        </div>

        {/* Highlights Section */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white/20">
          <div className="flex items-center mb-6">
            <Award className="w-8 h-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl font-bold">Placement Highlights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <p className="text-gray-400 text-sm mb-2">{highlight.label}</p>
                <p className="text-3xl font-bold text-yellow-400 mb-2">
                  {highlight.value}
                </p>
                <p className="text-sm text-gray-300">{highlight.subtext}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 text-sm mb-1">Total Students</p>
                <p className="text-4xl font-bold">198</p>
              </div>
              <div className="h-20 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 text-sm mb-1">Companies Visited</p>
                <p className="text-4xl font-bold">23</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 text-sm mb-1">Internship Offers</p>
                <p className="text-4xl font-bold">20</p>
              </div>
              <div className="h-20 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 text-sm mb-1">Placement Offers</p>
                <p className="text-4xl font-bold">19</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-12 text-center">
          <h3 className="text-2xl font-semibold mb-4">Key Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="text-blue-700">
                Top-tier companies including PhonePe, Arctic Wolf Networks, and
                Thomson Reuters
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="text-blue-700">
                Diverse opportunities in Product and Service-based companies
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="text-blue-700">
                Both Internship-only and Full-time placement opportunities
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="text-blue-700">
                Multiple offers from renowned organizations like DRDO and Cisco
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <a
            href="https://sites.google.com/rvu.edu.in/socseplacementportal/home"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-100 to-green-600 hover:from-blue-100 hover:to-green-700 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Visit Placement Portal for More Details
          </a>
        </div>
      </div>

      {/* Moving Companies Ticker */}
      <div className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-6 overflow-hidden">
        <div className="flex items-center space-x-2 mb-3 px-4">
          <Briefcase className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold  text-gray-300">
            COMPANIES VISITED
          </h3>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="flex animate-scroll whitespace-nowrap">
            {companies
              .concat(companies)
              .concat(companies)
              .map((company, index) => (
                <span
                  key={`first-${index}`}
                  className="inline-block mx-8 text-xl font-semibold text-gray-300"
                >
                  {company}
                </span>
              ))}
          </div>
          <div
            className="flex animate-scroll whitespace-nowrap absolute top-0"
            aria-hidden="true"
          >
            {companies
              .concat(companies)
              .concat(companies)
              .map((company, index) => (
                <span
                  key={`second-${index}`}
                  className="inline-block mx-8 text-xl font-semibold text-gray-300"
                >
                  {company}
                </span>
              ))}
          </div>
        </div>
      </div>

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
          animation: scroll 50s linear infinite;
        }
      `}</style>
    </div>
  );
}
