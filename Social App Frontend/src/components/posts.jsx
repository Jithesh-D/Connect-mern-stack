import { useContext, useState } from "react";
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
    <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 border border-gray-100 overflow-hidden group">
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {post.title}
            </h2>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {formatDistanceToNow(createdDate, { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Action Buttons - Positioned at top right */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
            {!showDeleteConfirm ? (
              <>
                {/* Delete Button - Top Right Corner */}
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                  title="Delete Post"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>

                {/* Edit Button - Below Delete Button */}
                <button
                  onClick={handleEdit}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                  title="Edit Post"
                >
                  <Edit3 className="h-4 w-4 text-white" />
                </button>
              </>
            ) : (
              <div className="flex space-x-1 animate-pulse bg-white rounded-lg p-1 shadow-lg">
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors duration-200"
                >
                  Confirm
                </button>
                <button
                  onClick={cancelDelete}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed text-sm line-clamp-4">
            {post.body}
          </p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium rounded-full hover:from-blue-200 hover:to-purple-200 transition-colors duration-200 cursor-pointer"
              >
                <Hash className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={handleReaction}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLiked
                  ? "bg-blue-500 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              }`}
            >
              <ThumbsUp
                className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
              />
              <span>{currentReactions}</span>
              <span className="ml-1 hidden sm:inline">
                {currentReactions === 1 ? "Like" : "Likes"}
              </span>
            </button>

            <button className="inline-flex items-center px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 transition-all duration-200">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Comment</span>
            </button>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
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
