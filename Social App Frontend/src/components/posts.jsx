import { useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import {
  Trash2,
  Edit3,
  Heart,
  MessageCircle,
  Clock,
  Hash,
  MoreVertical,
} from "lucide-react";
import { PostList } from "../store/postListContext.jsx";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { deletePostFromServer } from "../services/service.jsx";
import { User } from "lucide-react";
import React from "react";
import { normalizeTags } from "../utils/tags";
import CommentSection from "./CommentsSection.jsx";
import { useDarkMode } from "../store/darkModeContext";
import { usePersistentLike } from "../hooks/usePersistentLike";

const Post = ({ post }) => {
  const { deletePost } = useContext(PostList);
  const navigate = useNavigate();
  const [currentReactions, setReaction] = useState(post.reactions || 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const sessionUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch (e) {
      return null;
    }
  })();
  const currentUserId = sessionUser?.id || sessionUser?._id || null;

  // Use persistent like hook
  const { isLiked, likeCount, isProcessing, toggleLike } = usePersistentLike(
    post,
    currentUserId
  );

  // Update local reaction count when hook updates
  useEffect(() => {
    setReaction(likeCount);
  }, [likeCount]);
  const postOwnerId =
    post.userId || post.author?.id || post.author?._id || null;
  const isOwner =
    postOwnerId &&
    currentUserId &&
    String(postOwnerId) === String(currentUserId);

  // Ensure we always render the latest author info: prefer post.author if present,
  // otherwise fall back to the currently logged-in user (sessionStorage).
  const displayAuthor = post.author
    ? post.author
    : sessionUser
    ? {
        id: sessionUser.id || sessionUser._id || null,
        username: sessionUser.username || sessionUser.name || "You",
        profileImage: sessionUser.profileImage || null,
      }
    : { id: null, username: "Unknown User", profileImage: null };

  // Helper: tolerate either a full URL or a server-relative path
  const getProfileImageSrc = (raw) => {
    if (!raw) return null;
    try {
      if (typeof raw !== "string") return null;
      if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
      // If server returns a leading slash path, prepend API base
      return `${API_BASE_URL}${raw}`;
    } catch (e) {
      return null;
    }
  };

  // local state to handle image load errors so fallback shows reliably
  const [avatarErrored, setAvatarErrored] = useState(false);

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

  const displayTags = normalizeTags(post.tags);

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
    await toggleLike();
  };

  const handleEdit = () => {
    navigate("/create-post", { state: { post } });
    setShowOptions(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setShowOptions(false);
  };

  const handleCommentClick = () => setShowComments(true);
  const handleCloseComments = () => setShowComments(false);
  const toggleOptions = () => setShowOptions(!showOptions);
  const isAuthenticated = sessionStorage.getItem("user");

  // Helper component to load image, compute natural aspect ratio and clamp to Instagram-style bounds
  const PostImage = ({ src, alt }) => {
    const [aspect, setAspect] = useState(null);

    useEffect(() => {
      let mounted = true;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        if (!mounted) return;
        const ratio = img.naturalWidth / img.naturalHeight; // width / height
        const minRatio = 1.0 / (4 / 5); // 0.8 (4:5 portrait) -> width/height = 0.8
        // note: minRatio computed but we'll use literal for clarity
        const clamped = Math.max(0.8, Math.min(1.91, ratio));
        setAspect(clamped);
      };
      img.onerror = () => {
        if (!mounted) return;
        setAspect(16 / 9);
      };
      img.src = src;
      return () => {
        mounted = false;
      };
    }, [src]);

    // Use CSS aspect-ratio when available; fall back to a sensible default while loading
    const containerStyle = {
      aspectRatio: aspect ? String(aspect) : "16/9",
      maxHeight: "70vh",
      width: "100%",
    };

    return (
      <div
        className="mb-4 rounded-lg overflow-hidden relative"
        style={containerStyle}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover block"
          onError={(e) => {
            console.error("Image failed to load:", src);
            e.target.style.display = "none";
          }}
        />
      </div>
    );
  };

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
              {getProfileImageSrc(displayAuthor?.profileImage) &&
              !avatarErrored ? (
                <img
                  src={getProfileImageSrc(displayAuthor.profileImage)}
                  alt={displayAuthor?.username || "User"}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarErrored(true)}
                />
              ) : (
                // Fallback: show first letter or user icon
                <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm bg-transparent">
                  {displayAuthor?.username ? (
                    displayAuthor.username.charAt(0).toUpperCase()
                  ) : (
                    <User className="text-white" size={18} />
                  )}
                </div>
              )}
            </div>

            {/* Username and Timestamp */}
            <div className="flex flex-col">
              <span
                className={`font-semibold text-sm ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {displayAuthor?.username || "Unknown User"}
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
            <PostImage src={`${API_BASE_URL}${post.image}`} alt={post.title} />
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
          {displayTags && displayTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {displayTags.map((tag, index) => (
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
            <div className="flex items-center space-x-3">
              {/* Updated Like/Unlike Button with Heart Icon */}
              <button
                onClick={handleReaction}
                disabled={isProcessing}
                className="flex items-center space-x-2 p-2 rounded-full group transition-colors duration-200 hover:bg-red-500/10"
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <Heart
                  size={20}
                  className={`transition-all duration-300 ease-in-out transform group-hover:scale-110 ${
                    isLiked
                      ? "text-red-500 fill-red-500"
                      : isDarkMode
                      ? "text-gray-400 group-hover:text-red-500"
                      : "text-gray-600 group-hover:text-red-500"
                  }`}
                />
                <span
                  className={`font-medium text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {currentReactions}
                </span>
              </button>

              {/* Comment Button */}
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
