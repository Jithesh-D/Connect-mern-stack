import { useContext, useState } from "react";
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
    <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 mb-6">
      <div className="flex justify-end p-4 pb-0 space-x-2">
        {!showDeleteConfirm ? (
          <>
            <button
              onClick={handleEdit}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-transform duration-200 hover:scale-110"
              title="Edit Post"
            >
              <Edit3 size={18} strokeWidth={2} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-transform duration-200 hover:scale-110"
              title="Delete Post"
            >
              <Trash2 size={18} strokeWidth={2} />
            </button>
          </>
        ) : (
          <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-lg border">
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors duration-200"
            >
              Confirm
            </button>
            <button
              onClick={cancelDelete}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Title */}
        <h5 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors duration-200">
          {post.title}
        </h5>

        {/* Timestamp */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Clock size={16} strokeWidth={2} className="mr-1 text-gray-600" />
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
        <p className="text-gray-700 mb-4 leading-relaxed">{post.body}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors duration-200"
              >
                <Hash size={14} strokeWidth={2} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex space-x-3">
            <button
              onClick={handleReaction}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLiked
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              <ThumbsUp size={16} strokeWidth={2} className="mr-2" />
              <span>{currentReactions}</span>
            </button>

            <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200">
              <MessageCircle size={16} strokeWidth={2} className="mr-2" />
              <span className="hidden sm:inline">Comment</span>
            </button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            <span>Active</span>
          </div>
        </div>
      </div>
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
