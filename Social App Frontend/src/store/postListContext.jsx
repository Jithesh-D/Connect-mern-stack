import { createContext, useReducer } from "react";
import React from "react";

export const PostList = createContext({
  postList: [],
  addPost: () => {},
  deletePost: () => {},
  addInitialPost: () => {},
  editPost: () => {},
});

const postListReducer = (currPostList, action) => {
  switch (action.type) {
    case "DELETE_POST":
      return currPostList.filter((post) => post.id !== action.payload.postId);

    case "ADD_POST":
      return [action.payload, ...currPostList];

    case "ADD_INITIAL_POSTS":
      return currPostList.length === 0 ? action.payload.posts : currPostList;

    case "EDIT_POST":
      return currPostList.map((post) =>
        post.id === action.payload.id
          ? {
              ...post,
              title: action.payload.title,
              body: action.payload.body,
              tags: action.payload.tags,
            }
          : post
      );

    default:
      return currPostList;
  }
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);

  const addPost = (id, postTitle, postBody, tags) => {
    dispatchPostList({
      type: "ADD_POST",
      payload: {
        id,
        title: postTitle,
        body: postBody,
        reactions: 0,
        tags,
      },
    });
  };

  const addInitialPost = (posts) => {
    dispatchPostList({
      type: "ADD_INITIAL_POSTS",
      payload: { posts },
    });
  };

  const deletePost = (postId) => {
    dispatchPostList({
      type: "DELETE_POST",
      payload: { postId },
    });
  };

  const editPost = (id, updatedTitle, updatedBody, updatedTags) => {
    dispatchPostList({
      type: "EDIT_POST",
      payload: {
        id,
        title: updatedTitle,
        body: updatedBody,
        tags: updatedTags,
      },
    });
  };

  return (
    <PostList.Provider
      value={{
        postList,
        addPost,
        deletePost,
        addInitialPost,
        editPost,
      }}
    >
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;
