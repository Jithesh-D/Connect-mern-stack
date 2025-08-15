import { useContext, useState } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { PostList } from "../store/postListContext.jsx";
import { formatDistanceToNow } from "date-fns";
import {
  deletePostFromServer,
  editReactionFromServer,
} from "../services/service.jsx";

const Post = ({ post }) => {
  const { deletePost } = useContext(PostList);
  const [currentReactions, setReaction] = useState(post.reactions || 0);
  //to the PostTimeCreated
  const createdDate = post.createdAt ? new Date(post.createdAt) : new Date();

  const handleDelete = async () => {
    try {
      await deletePostFromServer(post.id);
      deletePost(post.id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleReaction = async () => {
    try {
      const updatedReactions = await editReactionFromServer(post.id);
      setReaction(updatedReactions.reactions);
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  return (
    <div
      className="card shadow-sm mb-4 Cards"
      style={{ width: "100%", maxWidth: "600px" }}
    >
      <div className="card-body post-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{post.title}</h5>
          <span
            className=" btn position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            onClick={handleDelete}
          >
            <RiDeleteBin2Fill />
          </span>
          <small className="text-muted">
            {formatDistanceToNow(createdDate, { addSuffix: true })}
          </small>
        </div>
        <p className="card-text">{post.body}</p>
        {post.tags.map((tag) => (
          <span key={tag} className="badge text-bg-primary hashtag">
            {tag}
          </span>
        ))}
        <div className="d-flex justify-content-between align-items-center">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={handleReaction}
            >
              👍 {currentReactions}
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary">
              💬 Comment
            </button>
          </div>
          <small className="text-muted"></small>
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
