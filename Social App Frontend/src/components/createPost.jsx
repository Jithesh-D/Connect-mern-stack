import { useContext, useRef } from "react";
import { PostList as PostListData } from "../store/postListContext";
import { useNavigate } from "react-router-dom";
import { addPostToServer } from "../services/service.jsx";

const CreatePost = () => {
  const { addPost } = useContext(PostListData);
  const navigate = useNavigate();
  // const userIdElement = useRef();
  const postTitleElement = useRef();
  const postBodyElement = useRef();
  const reactionsElement = useRef();
  const tagsElement = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const postTitle = postTitleElement.current.value;
    const postBody = postBodyElement.current.value;
    const reactions = reactionsElement.current.value;
    const tags = tagsElement.current.value
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);

    try {
      const newPost = await addPostToServer(
        postTitle,
        postBody,
        tags,
        parseInt(reactions) || 0
      );
      addPost(newPost.title, newPost.body, newPost.reactions, newPost.tags);

      postTitleElement.current.value = "";
      postBodyElement.current.value = "";
      reactionsElement.current.value = "";
      tagsElement.current.value = "";

      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
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

      <div className="mb-3">
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
      </div>

      <div className="mb-3">
        <label htmlFor="tags" className="form-label">
          Enter your hashtags here
        </label>
        <input
          type="text"
          className="form-control"
          id="tags"
          ref={tagsElement}
          placeholder="Enter tags separated by spaces (e.g., programming javascript react)"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Post
      </button>
    </form>
  );
};

export default CreatePost;
