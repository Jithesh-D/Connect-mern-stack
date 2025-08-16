const addPostToServer = async (title, body, tags, reactions) => {
  try {
    const response = await fetch("http://localhost:3001/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body, tags, reactions: 0 }),
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
  const response = await fetch("http://localhost:3001/api/posts");
  const posts = await response.json();
  return posts.map(mapPostFromServer);
};
const deletePostFromServer = async (postId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
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

const updatePostInServer = async (id, title, body, tags) => {
  try {
    const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body, tags }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();
    return mapPostFromServer(post);
  } catch (error) {
    console.error("Error in editPostInServer:", error);
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
  };
};

export {
  addPostToServer,
  getPostsFromServer,
  deletePostFromServer,
  editReactionFromServer,
  updatePostInServer,
};
