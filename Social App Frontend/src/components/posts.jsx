// import { useContext, useState, useEffect } from "react";
// import { API_BASE_URL } from "../config";
// import {
//   Trash2,
//   Edit3,
//   ThumbsUp,
//   MessageCircle,
//   Clock,
//   Hash,
// } from "lucide-react";
// import { PostList } from "../store/postListContext.jsx";
// import { formatDistanceToNow } from "date-fns";
// import { useNavigate } from "react-router-dom";
// import {
//   deletePostFromServer,
//   editReactionFromServer,
// } from "../services/service.jsx";
// import React from "react";
// import CommentSection from "./CommentsSection.jsx";

// const Post = ({ post }) => {
//   const { deletePost } = useContext(PostList);
//   const navigate = useNavigate();
//   const [currentReactions, setReaction] = useState(post.reactions || 0);
//   const [isLiked, setIsLiked] = useState(
//     post.likedBy?.includes(localStorage.getItem("userId"))
//   );
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [commentsCount, setCommentsCount] = useState(0);

//   // Check for dark mode on component mount
//   useEffect(() => {
//     const checkDarkMode = () => {
//       const darkMode =
//         document.documentElement.classList.contains("dark") ||
//         localStorage.getItem("theme") === "dark" ||
//         (!localStorage.getItem("theme") &&
//           window.matchMedia("(prefers-color-scheme: dark)").matches);
//       setIsDarkMode(darkMode);
//     };

//     checkDarkMode();

//     // Listen for theme changes
//     const observer = new MutationObserver(checkDarkMode);
//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   // Fetch comments count when component mounts
//   useEffect(() => {
//     const fetchCommentsCount = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:3001/api/comments/${post.id}`,
//           {
//             credentials: "include",
//           }
//         );
//         if (response.ok) {
//           const comments = await response.json();
//           setCommentsCount(comments.length);
//         }
//       } catch (error) {
//         console.error("Error fetching comments count:", error);
//       }
//     };

//     fetchCommentsCount();
//   }, [post.id]);

//   const createdDate = post.createdAt ? new Date(post.createdAt) : new Date();

//   const handleDelete = async () => {
//     if (!showDeleteConfirm) {
//       setShowDeleteConfirm(true);
//       return;
//     }

//     try {
//       await deletePostFromServer(post.id);
//       deletePost(post.id);
//       setShowDeleteConfirm(false);
//     } catch (error) {
//       console.error("Error deleting post:", error);
//       setShowDeleteConfirm(false);
//     }
//   };

//   const handleReaction = async () => {
//     if (!isAuthenticated) {
//       // Optionally show a message or redirect to login
//       navigate("/login");
//       return;
//     }

//     try {
//       const updatedReactions = await editReactionFromServer(post.id);
//       setReaction(updatedReactions.reactions);
//       setIsLiked(updatedReactions.hasLiked);
//     } catch (error) {
//       console.error("Error updating reaction:", error);
//     }
//   };

//   const handleEdit = () => {
//     navigate("/create-post", { state: { post } });
//   };

//   const cancelDelete = () => {
//     setShowDeleteConfirm(false);
//   };

//   const handleCommentClick = () => {
//     setShowComments(true);
//   };

//   const handleCloseComments = () => {
//     setShowComments(false);
//   };

//   const isAuthenticated = sessionStorage.getItem("user");

//   return (
//     <>
//       <div
//         className={`w-full max-w-lg border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mb-6 ${
//           isDarkMode
//             ? "bg-gray-800 border-gray-700 hover:shadow-blue-500/10"
//             : "bg-white border-gray-200"
//         }`}
//       >
//         <div className="flex justify-end p-4 pb-0 space-x-2">
//           {!showDeleteConfirm ? (
//             <>
//               <button
//                 onClick={handleEdit}
//                 className={`p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 ${
//                   isDarkMode
//                     ? "bg-blue-600 hover:bg-blue-500 text-white"
//                     : "bg-blue-600 hover:bg-blue-700 text-white"
//                 }`}
//                 title="Edit Post"
//               >
//                 <Edit3 size={18} strokeWidth={2} />
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className={`p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 ${
//                   isDarkMode
//                     ? "bg-red-600 hover:bg-red-500 text-white"
//                     : "bg-red-600 hover:bg-red-700 text-white"
//                 }`}
//                 title="Delete Post"
//               >
//                 <Trash2 size={18} strokeWidth={2} />
//               </button>
//             </>
//           ) : (
//             <div
//               className={`flex space-x-2 rounded-lg p-1 shadow-lg border ${
//                 isDarkMode
//                   ? "bg-gray-700 border-gray-600"
//                   : "bg-white border-gray-200"
//               }`}
//             >
//               <button
//                 onClick={handleDelete}
//                 className={`px-3 py-1 text-xs rounded transition-colors duration-200 ${
//                   isDarkMode
//                     ? "bg-red-600 hover:bg-red-500 text-white"
//                     : "bg-red-600 hover:bg-red-700 text-white"
//                 }`}
//               >
//                 Confirm
//               </button>
//               <button
//                 onClick={cancelDelete}
//                 className={`px-3 py-1 text-xs rounded transition-colors duration-200 ${
//                   isDarkMode
//                     ? "bg-gray-600 hover:bg-gray-500 text-white"
//                     : "bg-gray-500 hover:bg-gray-600 text-white"
//                 }`}
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Card Body */}
//         <div className="p-4">
//           {/* Title */}
//           <h5
//             className={`text-xl font-semibold mb-2 transition-colors duration-200 ${
//               isDarkMode
//                 ? "text-white hover:text-blue-400"
//                 : "text-gray-900 hover:text-blue-600"
//             }`}
//           >
//             {post.title}
//           </h5>

//           {/* Timestamp */}
//           <div
//             className={`flex items-center text-sm mb-3 ${
//               isDarkMode ? "text-gray-400" : "text-gray-500"
//             }`}
//           >
//             <Clock
//               size={16}
//               strokeWidth={2}
//               className={`mr-1 ${
//                 isDarkMode ? "text-gray-500" : "text-gray-600"
//               }`}
//             />
//             <span>{formatDistanceToNow(createdDate, { addSuffix: true })}</span>
//           </div>

//           {/* Image Section */}
//           {post.image && (
//             <div className="mb-4">
//               <img
//                 src={`${API_BASE_URL}${post.image}`}
//                 alt={post.title}
//                 className="w-full h-60 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
//                 onError={(e) => {
//                   console.error("Image failed to load:", post.image);
//                   e.target.style.display = "none";
//                 }}
//               />
//             </div>
//           )}

//           {/* Content */}
//           <p
//             className={`mb-4 leading-relaxed ${
//               isDarkMode ? "text-gray-300" : "text-gray-700"
//             }`}
//           >
//             {post.body}
//           </p>

//           {/* Tags */}
//           {post.tags && post.tags.length > 0 && (
//             <div className="flex flex-wrap gap-2 mb-4">
//               {post.tags.map((tag, index) => (
//                 <span
//                   key={`${tag}-${index}`}
//                   className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
//                     isDarkMode
//                       ? "bg-blue-900/50 text-blue-300 hover:bg-blue-800/70 border border-blue-700/50"
//                       : "bg-blue-100 text-blue-700 hover:bg-blue-200"
//                   }`}
//                 >
//                   <Hash size={14} strokeWidth={2} className="mr-1" />
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div
//             className={`flex items-center justify-between pt-2 border-t ${
//               isDarkMode ? "border-gray-700" : "border-gray-100"
//             }`}
//           >
//             <div className="flex space-x-3">
//               <button
//                 onClick={handleReaction}
//                 className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                   isLiked
//                     ? isDarkMode
//                       ? "bg-blue-600 text-white hover:bg-blue-500"
//                       : "bg-blue-600 text-white hover:bg-blue-700"
//                     : isDarkMode
//                     ? "bg-gray-700 text-gray-300 hover:bg-blue-600/20 hover:text-blue-400 border border-gray-600"
//                     : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
//                 }`}
//               >
//                 <ThumbsUp size={16} strokeWidth={2} className="mr-2" />
//                 <span>{currentReactions}</span>
//               </button>

//               <button
//                 onClick={handleCommentClick}
//                 className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
//                   isDarkMode
//                     ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 hover:text-blue-400"
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600"
//                 }`}
//               >
//                 <MessageCircle size={16} strokeWidth={2} className="mr-2" />
//                 <span>{commentsCount}</span>
//               </button>
//             </div>

//             {/* Status Indicator */}
//             <div
//               className={`flex items-center text-xs ${
//                 isDarkMode ? "text-gray-400" : "text-gray-500"
//               }`}
//             >
//               <div
//                 className={`w-2 h-2 rounded-full mr-1 ${
//                   isDarkMode ? "bg-green-400" : "bg-green-400"
//                 }`}
//               ></div>
//               <span>Active</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Comments Modal */}
//       <CommentSection
//         postId={post.id}
//         isOpen={showComments}
//         onClose={handleCloseComments}
//       />
//     </>
//   );
// };

// export default Post;

import { useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import {
  Trash2,
  Edit3,
  ThumbsUp,
  MessageCircle,
  Clock,
  Hash,
  MoreVertical,
} from "lucide-react";
import { PostList } from "../store/postListContext.jsx";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  deletePostFromServer,
  editReactionFromServer,
} from "../services/service.jsx";
import React from "react";
import CommentSection from "./CommentsSection.jsx";

const Post = ({ post }) => {
  const { deletePost } = useContext(PostList);
  const navigate = useNavigate();
  const [currentReactions, setReaction] = useState(post.reactions || 0);
  const [isLiked, setIsLiked] = useState(
    post.likedBy?.includes(localStorage.getItem("userId"))
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  // Determine current logged-in user id and whether this post belongs to them
  const sessionUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch (e) {
      return null;
    }
  })();
  const currentUserId = sessionUser?.id || sessionUser?._id || null;
  const postOwnerId =
    post.userId || post.author?.id || post.author?._id || null;
  const isOwner =
    postOwnerId &&
    currentUserId &&
    String(postOwnerId) === String(currentUserId);

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

  // Fetch comments count when component mounts
  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/comments/${post.id}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const comments = await response.json();
          setCommentsCount(comments.length);
        }
      } catch (error) {
        console.error("Error fetching comments count:", error);
      }
    };

    fetchCommentsCount();
  }, [post.id]);

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
      setShowOptions(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      setShowDeleteConfirm(false);
      setShowOptions(false);
    }
  };

  const handleReaction = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const updatedReactions = await editReactionFromServer(post.id);
      setReaction(updatedReactions.reactions);
      setIsLiked(updatedReactions.hasLiked);
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  const handleEdit = () => {
    navigate("/create-post", { state: { post } });
    setShowOptions(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setShowOptions(false);
  };

  const handleCommentClick = () => {
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const isAuthenticated = sessionStorage.getItem("user");

  return (
    <>
      <div
        className={`w-full max-w-lg border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mb-6 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 hover:shadow-blue-500/10"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Header with User Info - Instagram Style */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center space-x-3">
            {/* User Profile Photo */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
              {post.author?.profileImage ? (
                <img
                  src={`${API_BASE_URL}${post.author.profileImage}`}
                  alt={post.author?.username || "User"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                {post.author?.username
                  ? post.author.username.charAt(0).toUpperCase()
                  : "U"}
              </div>
            </div>

            {/* Username and Timestamp */}
            <div className="flex flex-col">
              <span
                className={`font-semibold text-sm ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {post.author?.username || "Unknown User"}
              </span>
              <span
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {formatDistanceToNow(createdDate, { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Options Button (only for post owner) */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={toggleOptions}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <MoreVertical size={18} strokeWidth={2} />
              </button>

              {/* Options Dropdown */}
              {showOptions && (
                <div
                  className={`absolute right-0 top-10 w-48 rounded-lg shadow-lg border z-10 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {!showDeleteConfirm ? (
                    <div className="py-1">
                      <button
                        onClick={handleEdit}
                        className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Edit3 size={16} strokeWidth={2} className="mr-3" />
                        Edit Post
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 ${
                          isDarkMode
                            ? "text-red-400 hover:bg-gray-700"
                            : "text-red-600 hover:bg-gray-100"
                        }`}
                      >
                        <Trash2 size={16} strokeWidth={2} className="mr-3" />
                        Delete Post
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <p
                        className={`text-sm mb-2 px-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Delete this post?
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleDelete}
                          className={`flex-1 px-3 py-1 text-xs rounded transition-colors duration-200 ${
                            isDarkMode
                              ? "bg-red-600 hover:bg-red-500 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          Delete
                        </button>
                        <button
                          onClick={cancelDelete}
                          className={`flex-1 px-3 py-1 text-xs rounded transition-colors duration-200 ${
                            isDarkMode
                              ? "bg-gray-600 hover:bg-gray-500 text-white"
                              : "bg-gray-500 hover:bg-gray-600 text-white"
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="px-4 pb-4">
          {/* Title */}
          <h5
            className={`text-xl font-semibold mb-3 transition-colors duration-200 ${
              isDarkMode
                ? "text-white hover:text-blue-400"
                : "text-gray-900 hover:text-blue-600"
            }`}
          >
            {post.title}
          </h5>

          {/* Image Section */}
          {post.image && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={`${API_BASE_URL}${post.image}`}
                alt={post.title}
                className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
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
            className={`flex items-center justify-between pt-3 border-t ${
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
                onClick={handleCommentClick}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 hover:text-blue-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600"
                }`}
              >
                <MessageCircle size={16} strokeWidth={2} className="mr-2" />
                <span>{commentsCount}</span>
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
      </div>

      {/* Comments Modal */}
      <CommentSection
        postId={post.id}
        isOpen={showComments}
        onClose={handleCloseComments}
      />
    </>
  );
};

export default Post;
