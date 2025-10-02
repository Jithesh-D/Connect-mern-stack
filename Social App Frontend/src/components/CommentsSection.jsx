import React, { useState, useEffect } from "react";
import { commentService } from "../services/commentService";
import { MessageCircle, X, Trash2 } from "lucide-react";

const CommentSection = ({ postId, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains("dark");
      setIsDarkMode(darkMode);
    };
    checkDarkMode();
  }, []);

  // Add Escape key listener and body scroll control
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Fetch comments when component opens
  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  // Define fetchComments function
  const fetchComments = async () => {
    try {
      setLoading(true);
      const commentsData = await commentService.getComments(postId);
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const savedComment = await commentService.addComment(postId, newComment);
      setComments((prevComments) => [savedComment, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setDeletingCommentId(commentId);

    try {
      console.log("Attempting to delete comment:", commentId);
      await commentService.deleteComment(commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
      console.log("Comment deleted successfully");
    } catch (error) {
      console.error("Full error deleting comment:", error);

      let errorMessage = "Failed to delete comment. ";

      if (error.message.includes("401")) {
        errorMessage += "You are not logged in.";
      } else if (error.message.includes("403")) {
        errorMessage += "You can only delete your own comments.";
      } else if (error.message.includes("404")) {
        errorMessage += "Comment not found.";
      } else {
        errorMessage += "Please try again.";
      }

      alert(errorMessage);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentUser = () => {
    try {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        console.log("Current user from session:", user);
        return user;
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // Function to check if user can delete comment
  const canDeleteComment = (comment) => {
    if (!currentUser) return false;

    const currentUserId = currentUser.id || currentUser._id;
    const commentAuthorId = comment.author?._id || comment.author;

    console.log("Delete check:", {
      currentUserId,
      commentAuthorId,
      currentUserIdType: typeof currentUserId,
      commentAuthorIdType: typeof commentAuthorId,
    });

    if (!currentUserId || !commentAuthorId) return false;

    // Convert both to string for comparison
    const currentUserIdStr = currentUserId.toString();
    const commentAuthorIdStr = commentAuthorId.toString();

    console.log("String comparison:", {
      currentUserIdStr,
      commentAuthorIdStr,
      match: currentUserIdStr === commentAuthorIdStr,
    });

    return currentUserIdStr === commentAuthorIdStr;
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${
        isDarkMode ? "dark" : ""
      }`}
      onClick={(e) => {
        // Close when clicking the backdrop (outside the modal)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full max-w-md max-h-[80vh] rounded-xl shadow-2xl transform transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <MessageCircle
              size={20}
              className={isDarkMode ? "text-blue-400" : "text-blue-600"}
            />
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Comments
            </h3>
            <span
              className={`text-sm px-2 py-1 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {comments.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 max-h-96">
          {loading ? (
            <div
              className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div
              className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
              <p>No comments yet.</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => {
              const canDelete = canDeleteComment(comment);

              return (
                <div
                  key={comment._id}
                  className="flex justify-between items-start mb-4 group"
                >
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className={`font-semibold text-sm ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {comment.authorName || comment.author?.name || "User"}
                      </span>
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {comment.text}
                    </p>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      disabled={deletingCommentId === comment._id}
                      className={`text-xs transition-all duration-200 ml-2 p-1 rounded ${
                        deletingCommentId === comment._id
                          ? "opacity-50 cursor-not-allowed"
                          : "opacity-70 group-hover:opacity-100"
                      } ${
                        isDarkMode
                          ? "text-red-400 hover:bg-red-900 hover:bg-opacity-50"
                          : "text-red-500 hover:bg-red-100"
                      }`}
                      title="Delete comment"
                    >
                      {deletingCommentId === comment._id ? (
                        "Deleting..."
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Comment Form */}
        {currentUser && (
          <form
            onSubmit={handleAddComment}
            className={`p-4 border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className={`flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-800 disabled:text-gray-400"
                    : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:text-gray-500"
                }`}
              >
                Post
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
