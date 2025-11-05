import React from "react";
import { Star, Mail } from "lucide-react";
import { useDarkMode } from "../store/darkModeContext";

const DeveloperInfoCard = () => {
  const handleStarClick = () => {
    window.open("https://github.com/Jithesh-D/RVU-CONNECT", "_blank");
  };

  const handleMailClick = () => {
    window.location.href = "mailto:jitheshdbtech24@rvu.edu.in";
  };

  const { isDarkMode } = useDarkMode();

  const wrapperClass = isDarkMode
    ? "w-full bg-[#0A1024] text-gray-300 py-16 flex flex-col items-center justify-center text-center"
    : "w-full bg-white text-gray-800 py-16 flex flex-col items-center justify-center text-center border-t border-gray-200";

  const headerTextClass = isDarkMode
    ? "text-2xl font-semibold text-white tracking-wide"
    : "text-2xl font-semibold text-gray-900 tracking-wide";

  const roleClass = isDarkMode
    ? "text-blue-400 text-lg font-light mb-6"
    : "text-blue-600 text-lg font-light mb-6";

  const descClass = isDarkMode
    ? "text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium text-sm sm:text-base mb-10"
    : "text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium text-sm sm:text-base mb-10";

  const starBtnClass = isDarkMode
    ? "flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg border border-blue-500 text-blue-400 font-normal hover:bg-blue-600/10 transition-all duration-300"
    : "flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg border border-blue-500 text-blue-600 font-normal hover:bg-blue-50 transition-all duration-300";

  const joinBtnClass = isDarkMode
    ? "flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-normal hover:opacity-90 transition-all duration-300"
    : "flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-normal hover:opacity-90 transition-all duration-300";

  return (
    <footer className={wrapperClass}>
      {/* Gradient Top Border */}
      <div className="w-full h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-10"></div>

      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span
          className={
            isDarkMode
              ? "font-mono text-lg text-gray-400"
              : "font-mono text-lg text-gray-500"
          }
        >
          &lt;/&gt;
        </span>
        <h2 className={headerTextClass}>Developer Info</h2>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-white">JD</span>
        </div>
      </div>

      {/* Developer Name */}
      <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-1">
        Jithesh D
      </h1>

      {/* Role */}
      <p className={roleClass}>Computer Science Engineering</p>

      {/* Description */}
      <p className={descClass}>
        If you appreciate my work and find this platform helpful, please
        consider starring the GitHub project! I'm always looking for passionate
        contributors to help make this platform even better.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* Star Project */}
        <button onClick={handleStarClick} className={starBtnClass}>
          <Star className="w-4 h-4" />
          <span>Star Project</span>
        </button>

        {/* Join Contributors */}
        <button onClick={handleMailClick} className={joinBtnClass}>
          <Mail className="w-4 h-4" />
          <span>Join Contributors</span>
        </button>
      </div>

      {/* Bottom spacing */}
      <div className="mt-10 w-11/12 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
    </footer>
  );
};

export default DeveloperInfoCard;
