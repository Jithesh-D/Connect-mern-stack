import React, { useState, useEffect } from "react";
import { addComment, getAllComments } from "../services/commentService";
import { CommentSkeletons } from "./CommentSkeleton";

const CommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all comments
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const data = await getAllComments();

      if (data.success) {
        setComments(data.comments);
      } else {
        setError("Failed to fetch comments");
      }
    } catch (err) {
      setError("Error fetching comments");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load comments on component mount
  useEffect(() => {
    fetchComments();
  }, []);

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await addComment(
        "current-user-id", // Replace with actual user ID from auth context
        newComment
      );

      if (data.success) {
        setNewComment("");
        fetchComments(); // Refresh comments list
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error posting comment");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Comments
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            maxLength={500}
            required
            disabled={loading}
            className={`w-full min-h-[100px] p-3 border rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       resize-y transition duration-150 ease-in-out
                       ${loading ? "opacity-50 cursor-not-allowed" : ""}
                       ${
                         error
                           ? "border-red-500 dark:border-red-500"
                           : "border-gray-300 dark:border-gray-600"
                       }`}
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500 dark:text-gray-400">
            {newComment.length}/500
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            {newComment.length >= 450 && (
              <span
                className={`${
                  newComment.length >= 490 ? "text-red-500" : "text-yellow-500"
                }`}
              >
                {500 - newComment.length} characters remaining
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className={`px-4 py-2 rounded-lg text-white font-medium
                      transition-all duration-300 ease-in-out
                      flex items-center gap-2
                      ${
                        loading || !newComment.trim()
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-md"
                      }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <span>Post Comment</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900 dark:text-red-100">
          {error}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <CommentSkeletons />
        ) : (
          <>
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-2
                         border border-gray-200 dark:border-gray-700 hover:border-gray-300 
                         dark:hover:border-gray-600 transition-all duration-300 ease-in-out
                         animate-fadeIn"
              >
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {comment.userId}
                  </span>
                  <span className="text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {comment.comment}
                </p>
              </div>
            ))}
            {!isLoading && comments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No comments yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
