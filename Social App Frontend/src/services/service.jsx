import { API_BASE_URL } from "../config";

const handleAuthError = (status) => {
  if (status === 401) {
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  }
};

const addPostToServer = async (
  title,
  body,
  tags,
  image,
  category = "general"
) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("tags", JSON.stringify(tags));
    formData.append("category", category);
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
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const post = await response.json();
    return mapPostFromServer(post);
  } catch (error) {
    console.error("Error in addPostToServer:", error);
    throw error;
  }
};

const getPostsFromServer = async () => {
  console.log("📝 Fetching posts with credentials from:", API_BASE_URL);
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    handleAuthError(response.status);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
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

// const editReactionFromServer = async (postId) => {
//   const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/reaction`, {
//     method: "PATCH",
//     credentials: "include",
//   });
//   const post = await response.json();
//   return mapPostFromServer(post);
// };

const updatePostInServer = async (
  id,
  title,
  body,
  tags,
  image,
  category = "general"
) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("category", category);

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

const editReactionFromServer = async (postId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/posts/${postId}/reaction`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      handleAuthError(response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in editReactionFromServer:", error);
    throw error;
  }
};

// New: like a post (one like per user)
const likePost = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      handleAuthError(response.status);
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in likePost:", error);
    throw error;
  }
};

// New: unlike a post
const unlikePost = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      handleAuthError(response.status);
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in unlikePost:", error);
    throw error;
  }
};

const API_KEY = "YOUR_API_KEY";

export async function checkToxicity(comment) {
  const response = await fetch(
    `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${AIzaSyCaXFRdpJV4Cir6oMTrCX_40q0DtmwZQ8I}`,
    {
      method: "POST",
      body: JSON.stringify({
        comment: { text: comment },
        languages: ["en"],
        requestedAttributes: { TOXICITY: {} },
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  const result = await response.json();
  const score = result.attributeScores.TOXICITY.summaryScore.value;

  return score; // returns a number between 0–1
}

const mapPostFromServer = (post) => {
  return {
    id: post._id,
    title: post.title,
    body: post.body,
    tags: post.tags,
    category: post.category || "general",
    reactions: post.reactions,
    likedBy: post.likedBy,
    image: post.image,
    createdAt: post.createdAt,
    // Author may be populated (object) or an id (string/ObjectId). Handle both.
    author: (function () {
      if (!post.author) {
        if (post.authorName)
          return { id: null, username: post.authorName, profileImage: null };
        return undefined;
      }

      // If author is an object with fields
      if (typeof post.author === "object") {
        return {
          id: post.author._id || post.author.id || String(post.author),
          username:
            post.author.username ||
            post.author.name ||
            post.authorName ||
            "Unknown User",
          profileImage: post.author.profileImage || null,
        };
      }

      // Otherwise treat it as an id string
      return {
        id: String(post.author),
        username: post.authorName || "Unknown User",
        profileImage: null,
      };
    })(),
  };
};

export {
  addPostToServer,
  getPostsFromServer,
  deletePostFromServer,
  editReactionFromServer,
  likePost,
  unlikePost,
  updatePostInServer,
};

// Logout helper
export const logout = async () => {
  try {
    console.log("🚪 Logging out from:", API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      sessionStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      console.log("✅ Logout successful");
      // Redirect user to signup page after logout
      window.location.href = "/signup";
    } else {
      console.error("❌ Logout failed", await response.text());
    }
  } catch (err) {
    console.error("❌ Error during logout:", err);
  }
};
