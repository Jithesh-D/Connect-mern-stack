import { API_BASE_URL } from "../config";

const handleAuthError = (status) => {
  if (status === 401) {
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  }
};

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
      handleAuthError(response.status);
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
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    credentials: "include",
  });
  const posts = await response.json();
  return posts.map(mapPostFromServer);
};

const deletePostFromServer = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
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
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/reaction`, {
    method: "PATCH",
    credentials: "include",
  });
  const post = await response.json();
  return mapPostFromServer(post);
};

const updatePostInServer = async (id, title, body, tags, image) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);

    // Handle tags
    if (tags && Array.isArray(tags)) {
      formData.append("tags", JSON.stringify(tags));
    }

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: formData, // No headers for multipart/form-data
    });

    if (!response.ok) {
      handleAuthError(response.status);
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
