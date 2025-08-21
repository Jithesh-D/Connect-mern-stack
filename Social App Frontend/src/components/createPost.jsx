import { useContext, useRef, useState, useEffect } from "react";
import { PostList as PostListData } from "../store/postListContext";
import { useNavigate, useLocation } from "react-router-dom";
import { addPostToServer, updatePostInServer } from "../services/service.jsx";

const CreatePost = () => {
  const { addPost, editPost } = useContext(PostListData);
  const navigate = useNavigate();
  const location = useLocation();

  const editingPost = location.state?.post || null;

  const postTitleElement = useRef();
  const postBodyElement = useRef();
  const tagsElement = useRef();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setIsEditing(true);
      postTitleElement.current.value = editingPost.title;
      postBodyElement.current.value = editingPost.body;
      tagsElement.current.value = editingPost.tags.join(" ");
    }
  }, [editingPost]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const postTitle = postTitleElement.current.value;
    const postBody = postBodyElement.current.value;
    const tags = tagsElement.current.value
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);

    try {
      if (isEditing) {
        const updatedPost = await updatePostInServer(
          editingPost.id,
          postTitle,
          postBody,
          tags,
          editingPost.reactions
        );
        editPost(
          updatedPost.id,
          updatedPost.title,
          updatedPost.body,
          updatedPost.tags
        );
      } else {
        const newPost = await addPostToServer(postTitle, postBody, tags, 0);
        addPost(newPost.id, newPost.title, newPost.body, newPost.tags);
      }

      navigate("/");
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  return (
    <form className="create-post Form" onSubmit={handleSubmit}>
      {/* <div className="mb-3">
        <label htmlFor="userId" className="form-label">
          Enter your User Id here
        </label>
        <input
          type="text"
          ref={userIdElement}
          className="form-control"
          id="userId"
          placeholder="Your User Id"
        />
      </div> */}

      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Post Title
        </label>
        <input
          type="text"
          ref={postTitleElement}
          className="form-control"
          id="title"
          placeholder="How are you feeling today..."
        />
      </div>

      <div className="mb-3">
        <label htmlFor="body" className="form-label">
          Post Content
        </label>
        <textarea
          type="text"
          ref={postBodyElement}
          rows="4"
          className="form-control"
          id="body"
          placeholder="Tell us more about it"
        />
      </div>

      {/* <div className="mb-3">
        <label htmlFor="reactions" className="form-label">
          Number of reactions
        </label>
        <input
          type="text"
          ref={reactionsElement}
          className="form-control"
          id="reactions"
          placeholder="How many people reacted to this post"
        />
      </div> */}

      <div className="mb-3">
        <label htmlFor="tags" className="form-label">
          Enter your hashtags here
        </label>
        <input
          type="text"
          className="form-control"
          id="tags"
          ref={tagsElement}
          placeholder="Enter tags separated by spaces (e.g., Always Be Happy)"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Post
      </button>
    </form>
  );
};

export default CreatePost;
