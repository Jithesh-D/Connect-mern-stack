import React, { useState } from "react";
import { Mail, Phone, ThumbsUp } from "lucide-react";

const ContributionCard = ({
  projectName,
  description,
  email,
  phone,
  date,
  interestedCount = 0,
  onJoin,
}) => {
  const [isInterested, setIsInterested] = useState(false);

  const handleJoinClick = () => {
    setIsInterested(!isInterested);
    onJoin?.();
  };

  // Button classes separated for clarity and to ensure dark-mode styling takes effect
  const baseButtonCls =
    "px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105";
  const joinedCls =
    "bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600";
  const interestCls =
    "bg-blue-500 text-white hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Left Section - Project Details */}
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {projectName}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </div>
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(date).toLocaleDateString()}
          </div>
        </div>

        {/* Right Section - Status Box & Action Button */}
        <div className="flex flex-col items-center gap-4 min-w-fit">
          <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg text-center">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <ThumbsUp className="w-4 h-4" />
              <span className="font-semibold">
                {interestedCount}+ interested
              </span>
            </div>
          </div>

          <button
            onClick={handleJoinClick}
            className={`${baseButtonCls} ${
              isInterested ? joinedCls : interestCls
            }`}
          >
            {isInterested ? "Joined" : "I'm Interested"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContributionCard;
