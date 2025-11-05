import React, { useState, useEffect, useRef } from "react";
import { useDarkMode } from "../store/darkModeContext";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Mail,
  Phone,
  ExternalLink,
  RefreshCw,
  Edit,
  Trash2,
  ThumbsUp,
  MoreVertical,
  Inbox, // For empty state
  AlertCircle, // For error state
} from "lucide-react";
import {
  getContributions,
  updateContribution,
  deleteContribution,
} from "../services/collabservice";
import axios from "axios";
import EditContributionModal from "./EditContributionModal";

// --- Custom hook to detect clicks outside an element ---
// This is for closing the dropdown menu
let useClickOutside = (handler) => {
  let domNode = useRef();

  useEffect(() => {
    let maybeHandler = (event) => {
      if (!domNode.current?.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);
    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const Contribution = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingContribution, setEditingContribution] = useState(null);
  const [interestedProjects, setInterestedProjects] = useState(new Set());
  const [interestCounts, setInterestCounts] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);

  const sessionUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch (e) {
      return null;
    }
  })();
  const currentUserEmail = sessionUser?.email || null;

  // --- All your original logic functions (unchanged) ---

  const handleInterest = async (contributionId) => {
    if (interestedProjects.has(contributionId)) return;

    try {
      const response = await axios.post(
        `http://localhost:3001/api/contributions/${contributionId}/interest`,
        {},
        { withCredentials: true }
      );

      setInterestedProjects((prev) => new Set([...prev, contributionId]));
      setInterestCounts((prev) => ({
        ...prev,
        [contributionId]: (prev[contributionId] || 0) + 1,
      }));
    } catch (error) {
      console.error("Error expressing interest:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert(
        `Failed to express interest: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const handleAddClick = () => {
    navigate("/add-contribution");
  };

  const fetchContributions = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      const data = await getContributions();
      setContributions(data);

      // Fetch interest data
      try {
        const interestResponse = await axios.get(
          "http://localhost:3001/api/contributions/interests",
          { withCredentials: true }
        );

        const { userInterests, counts } = interestResponse.data;
        setInterestedProjects(new Set(userInterests));
        setInterestCounts(counts);
      } catch (interestError) {
        console.error(
          "Error fetching interests:",
          interestError.response?.data || interestError.message
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetchContributions();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleEdit = (contribution) => {
    setEditingContribution(contribution);
  };

  const handleSaveEdit = async (formData) => {
    try {
      const updated = await updateContribution(
        editingContribution._id,
        formData
      );
      setContributions((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
    } catch (error) {
      console.error("Error updating contribution:", error);
      throw error;
    }
  };

  const handleDelete = async (contribution) => {
    if (window.confirm("Are you sure you want to delete this contribution?")) {
      try {
        await deleteContribution(contribution._id, contribution.email);
        setContributions((prev) =>
          prev.filter((c) => c._id !== contribution._id)
        );
      } catch (error) {
        console.error("Error deleting contribution:", error);
        alert("Failed to delete contribution: " + error.message);
      }
    }
  };

  const handleMenuToggle = (contributionId) => {
    setOpenMenuId(openMenuId === contributionId ? null : contributionId);
  };

  const handleEditClick = (contribution) => {
    handleEdit(contribution);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (contribution) => {
    handleDelete(contribution);
    setOpenMenuId(null);
  };

  // --- End of original logic functions ---

  // --- New Dropdown Menu Component ---
  const ContributionMenu = ({ contribution }) => {
    let menuRef = useClickOutside(() => {
      setOpenMenuId(null);
    });

    return (
      <div ref={menuRef} className="relative z-10">
        <button
          onClick={() => handleMenuToggle(contribution._id)}
          className={`p-2 rounded-full transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:bg-gray-700"
              : "text-gray-500 hover:bg-gray-100"
          }`}
          title="More options"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {openMenuId === contribution._id && (
          <div
            className={`absolute top-full right-0 mt-2 w-32 rounded-lg shadow-lg py-1 ${
              isDarkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-gray-200"
            }`}
          >
            <button
              onClick={() => handleEditClick(contribution)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left transition-colors ${
                isDarkMode
                  ? "text-gray-200 hover:bg-gray-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(contribution)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left transition-colors ${
                isDarkMode
                  ? "text-red-400 hover:bg-gray-600"
                  : "text-red-600 hover:bg-gray-100"
              }`}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  // --- New Card Component ---
  const ContributionCard = ({ contribution }) => {
    const isOwner = currentUserEmail && contribution.email === currentUserEmail;

    return (
      <div
        className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } overflow-hidden flex flex-col`}
      >
        {/* Card Header */}
        <div className="p-4 sm:p-6 flex justify-between items-start gap-4">
          <h3
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {contribution.projectName}
          </h3>
          {isOwner && <ContributionMenu contribution={contribution} />}
        </div>

        {/* Card Body */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 flex-grow">
          <p
            className={`text-sm leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {contribution.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span
                className={`text-sm truncate ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {contribution.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {contribution.phone}
              </span>
            </div>
            {contribution.sourceLinks && (
              <div className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                <a
                  href={contribution.sourceLinks.split("\n")[0]} // Only first link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline break-all"
                >
                  {contribution.sourceLinks.split("\n")[0]}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer - Interest Bar */}
        <div
          className={`px-4 py-3 ${
            isDarkMode
              ? "bg-gray-800/50 border-t border-gray-700"
              : "bg-gray-50 border-t border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between w-full gap-4">
            {/* Left Part */}
            <div className="flex items-center gap-2 overflow-hidden">
              <ThumbsUp className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div className="text-left overflow-hidden">
                <span
                  className={`font-bold text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Interested : {interestCounts[contribution._id] || 0}
                </span>
                <p
                  className={`text-xs truncate ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Show your interest
                </p>
              </div>
            </div>

            {/* Right Part - Button */}
            <div>
              <button
                onClick={() => handleInterest(contribution._id)}
                disabled={interestedProjects.has(contribution._id)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  interestedProjects.has(contribution._id)
                    ? "bg-green-600 text-white cursor-not-allowed"
                    : isDarkMode
                    ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    : "bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 shadow-sm"
                }`}
              >
                {interestedProjects.has(contribution._id)
                  ? "Interested"
                  : "I'm Interested"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- New Loading/Error/Empty State Components ---

  const LoadingState = () => (
    <div
      className={`mt-8 p-8 rounded-xl flex flex-col items-center justify-center ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 text-gray-400"
          : "bg-white border-gray-200 text-gray-500"
      }`}
    >
      <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      <span className="mt-4 text-lg">Loading contributions...</span>
    </div>
  );

  // --- THIS IS THE FIX ---
  const ErrorState = () => (
    <div className="mt-8 p-8 rounded-xl border bg-red-50 border-red-200 text-red-700 text-center">
      <div className="flex justify-center items-center gap-2">
        <AlertCircle className="h-6 w-6" />
        <span className="font-semibold">Error: {error}</span>
      </div>
    </div>
  );
  // --- END OF FIX ---

  const EmptyState = () => (
    <div
      className={`mt-8 p-12 rounded-xl border-2 border-dashed flex flex-col items-center justify-center ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <Inbox className="h-16 w-16 text-gray-400" />
      <p
        className={`text-xl font-semibold mt-6 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        No contributions yet.
      </p>
      <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        Be the first to add your idea or project!
      </p>
      <button
        onClick={handleAddClick}
        className="mt-6 flex items-center gap-2 px-5 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md"
      >
        <PlusCircle className="h-5 w-5" />
        Add Your Idea
      </button>
    </div>
  );

  // --- Main Render Function ---

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1
              className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Collab Hub
            </h1>
            <p
              className={`text-lg mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Share ideas, find collaborators.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={fetchContributions}
              disabled={loading}
              className={`flex items-center justify-center gap-2 w-1/2 sm:w-auto px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <RefreshCw
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleAddClick}
              className="flex items-center justify-center gap-2 w-1/2 sm:w-auto px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Add Idea</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : contributions.length === 0 ? (
          <EmptyState />
        ) : (
          // --- THIS IS THE RESPONSIVE LAYOUT ---
          // Mobile:  grid-cols-1 (List)
          // Desktop: lg:grid-cols-2 (2-col grid)
          // Large Desktop: 2xl:grid-cols-3 (3-col grid)
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {contributions.map((contribution) => (
              <ContributionCard
                key={contribution._id}
                contribution={contribution}
              />
            ))}
          </div>
        )}
      </div>

      {editingContribution && (
        <EditContributionModal
          contribution={editingContribution}
          onClose={() => setEditingContribution(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Contribution;
