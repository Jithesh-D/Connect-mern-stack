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

    case "EDIT_POST_FULL":
      return currPostList.map((post) =>
        post.id === action.payload.post.id ? action.payload.post : post
      );

    case "UPDATE_AUTHOR":
      return currPostList.map((post) => {
        const authorId =
          post.author?.id || post.author?._id || post.userId || null;
        if (authorId && String(authorId) === String(action.payload.userId)) {
          return {
            ...post,
            author: {
              ...(post.author || {}),
              username: action.payload.username || post.author?.username,
              profileImage:
                action.payload.profileImage !== undefined
                  ? action.payload.profileImage
                  : post.author?.profileImage,
            },
          };
        }
        return post;
      });

    default:
      return currPostList;
  }
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);

  // Accept a full post object (as returned by the server mapping) so all fields including image are preserved
  const addPost = (post) => {
    dispatchPostList({
      type: "ADD_POST",
      payload: post,
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

  // Replace a full post object (useful after server returns the updated post)
  const updatePost = (post) => {
    dispatchPostList({ type: "EDIT_POST_FULL", payload: { post } });
  };

  // Update author info across all posts for a given user id
  const updateAuthor = ({ userId, username, profileImage }) => {
    dispatchPostList({
      type: "UPDATE_AUTHOR",
      payload: { userId, username, profileImage },
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
        updatePost,
        updateAuthor,
      }}
    >
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;
