import { useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import {
  Trash2,
  Edit3,
  ThumbsUp,
  MessageCircle,
  Clock,
  Hash,
} from "lucide-react";
import { PostList } from "../store/postListContext.jsx";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  deletePostFromServer,
  editReactionFromServer,
} from "../services/service.jsx";
import React from "react";

const Post = ({ post }) => {
  const { deletePost } = useContext(PostList);
  const navigate = useNavigate();
  const [currentReactions, setReaction] = useState(post.reactions || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const createdDate = post.createdAt ? new Date(post.createdAt) : new Date();

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      await deletePostFromServer(post.id);
      deletePost(post.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      setShowDeleteConfirm(false);
    }
  };

  const handleReaction = async () => {
    try {
      const updatedReactions = await editReactionFromServer(post.id);
      setReaction(updatedReactions.reactions);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  const handleEdit = () => {
    navigate("/create-post", { state: { post } });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`w-full max-w-lg border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mb-6 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:shadow-blue-500/10"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-end p-4 pb-0 space-x-2">
        {!showDeleteConfirm ? (
          <>
            <button
              onClick={handleEdit}
              className={`p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              title="Edit Post"
            >
              <Edit3 size={18} strokeWidth={2} />
            </button>
            <button
              onClick={handleDelete}
              className={`p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 ${
                isDarkMode
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              title="Delete Post"
            >
              <Trash2 size={18} strokeWidth={2} />
            </button>
          </>
        ) : (
          <div
            className={`flex space-x-2 rounded-lg p-1 shadow-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <button
              onClick={handleDelete}
              className={`px-3 py-1 text-xs rounded transition-colors duration-200 ${
                isDarkMode
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              Confirm
            </button>
            <button
              onClick={cancelDelete}
              className={`px-3 py-1 text-xs rounded transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-600 hover:bg-gray-500 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Title */}
        <h5
          className={`text-xl font-semibold mb-2 transition-colors duration-200 ${
            isDarkMode
              ? "text-gray-100 hover:text-blue-400"
              : "text-gray-900 hover:text-blue-600"
          }`}
        >
          {post.title}
        </h5>

        {/* Timestamp */}
        <div
          className={`flex items-center text-sm mb-3 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <Clock
            size={16}
            strokeWidth={2}
            className={`mr-1 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
          />
          <span>{formatDistanceToNow(createdDate, { addSuffix: true })}</span>
        </div>

        {/* Image Section */}
        {post.image && (
          <div className="mb-4">
            <img
              src={`${API_BASE_URL}${post.image}`}
              alt={post.title}
              className="w-full h-60 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.error("Image failed to load:", post.image);
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Content */}
        <p
          className={`mb-4 leading-relaxed ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {post.body}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-blue-900/50 text-blue-300 hover:bg-blue-800/70 border border-blue-700/50"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                <Hash size={14} strokeWidth={2} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div
          className={`flex items-center justify-between pt-2 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <div className="flex space-x-3">
            <button
              onClick={handleReaction}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLiked
                  ? isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-blue-600/20 hover:text-blue-400 border border-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              <ThumbsUp size={16} strokeWidth={2} className="mr-2" />
              <span>{currentReactions}</span>
            </button>

            <button
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <MessageCircle size={16} strokeWidth={2} className="mr-2" />
              <span className="hidden sm:inline">Comment</span>
            </button>
          </div>

          {/* Status Indicator */}
          <div
            className={`flex items-center text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-1 ${
                isDarkMode ? "bg-green-400" : "bg-green-400"
              }`}
            ></div>
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Optional: Enhanced hover effect for dark mode */}
      <style jsx>{`
        @media (prefers-color-scheme: dark) {
          .post-card:hover {
            box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.1),
              0 10px 10px -5px rgba(59, 130, 246, 0.04);
          }
        }
      `}</style>
    </div>
  );
};

export default Post;

// const Post = ({ post }) => {
//   const { deletePost } = useContext(PostList);

//   return (
//     <div className="card Cards" style={{ width: "30rem" }}>
//       <div className="card-body">
//         <h5 className="card-title">
//           {post.title}
//           <span
//             className=" btn position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
//             onClick={() => deletePost(post.id)}
//           >
//             <RiDeleteBin2Fill />
//           </span>
//         </h5>
//         <p className="card-text">{post.body}</p>
//         {post.tags.map((tag) => (
//           <span key={tag} className="badge text-bg-primary hashtag">
//             {tag}
//           </span>
//         ))}
//         <div className="alert alert-success reactions" role="alert">
//           This post has been reacted by {Number(post.reactions)} people.
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Post;
