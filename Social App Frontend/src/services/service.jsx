import { API_BASE_URL } from "../config";

const addPostToServer = async (title, body, tags, image) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("tags", JSON.stringify(tags));
    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();
    return mapPostFromServer(post);
  } catch (error) {
    console.error("Error in addPostToServer:", error);
    throw error;
  }
};

const getPostsFromServer = async () => {
  const response = await fetch(`${API_BASE_URL}/api/posts`);
  const posts = await response.json();
  return posts.map(mapPostFromServer);
};

const deletePostFromServer = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return postId;
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
};

const editReactionFromServer = async (postId) => {
  const response = await fetch(
    `http://localhost:3001/api/posts/${postId}/reaction`,
    {
      method: "PATCH",
    }
  );
  const post = await response.json();
  return mapPostFromServer(post);
};

const updatePostInServer = async (id, title, body, tags, image) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);

    // Append each tag individually
    tags.forEach((tag) => formData.append("tags[]", tag));

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: formData, // No headers for multipart/form-data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();
    return mapPostFromServer(post);
  } catch (error) {
    console.error("Error in updatePostInServer:", error);
    throw error;
  }
};

const mapPostFromServer = (post) => {
  return {
    id: post._id,
    title: post.title,
    body: post.body,
    tags: post.tags,
    reactions: post.reactions,
    image: post.image,
  };
};

export {
  addPostToServer,
  getPostsFromServer,
  deletePostFromServer,
  editReactionFromServer,
  updatePostInServer,
};
