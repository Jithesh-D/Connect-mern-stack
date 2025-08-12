import { createContext, useReducer } from "react";

export const PostList = createContext({
  postList: [],
  addPost: () => {},
  deletePost: () => {},
  addInitialPost: () => {},
});

const postListReducer = (currPostList, action) => {
  let newPostList = currPostList;

  if (action.type === "DELETE_POST") {
    newPostList = currPostList.filter(
      (post) => post.id !== action.payload.postId
    );
  } else if (action.type === "ADD_POST") {
    newPostList = [action.payload, ...currPostList];
  } else if (action.type === "ADD_INITIAL_POSTS") {
    // Only add initial posts if the current list is empty
    // This prevents overwriting user-added posts
    if (currPostList.length === 0) {
      newPostList = action.payload.posts;
    } else {
      newPostList = currPostList;
    }
  }

  console.log(
    "Reducer action:",
    action.type,
    "New list length:",
    newPostList.length
  );
  return newPostList;
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);

  const addPost = (postTitle, postBody, reactions, tags) => {
    const newPost = {
      id: Date.now(),
      title: postTitle,
      body: postBody,
      reactions: parseInt(reactions) || 0,
      tags: tags,
    };

    dispatchPostList({
      type: "ADD_POST",
      payload: newPost,
    });
  };

  const addInitialPost = (posts) => {
    dispatchPostList({
      type: "ADD_INITIAL_POSTS",
      payload: { posts },
    });
  };

  const deletePost = (postId) => {
    console.log("Deleting post:", postId);
    dispatchPostList({
      type: "DELETE_POST",
      payload: {
        postId,
      },
    });
  };

  return (
    <PostList.Provider
      value={{ postList, addPost, deletePost, addInitialPost }}
    >
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;
