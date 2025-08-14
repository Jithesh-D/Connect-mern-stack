const addPostToServer = async (title, body, tags, reactions) => {
  const response = await fetch("http://localhost:3001/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body, tags, reactions }),
  });
  const post = await response.json();
  return mapPostFromServer(post);
};

const getPostsFromServer = async () => {
  const response = await fetch("http://localhost:3001/api/posts");
  const posts = await response.json();
  return posts.map(mapPostFromServer);
};
const deletePostFromServer = async (postId) => {
  await fetch(`http://localhost:3001/api/posts/${postId}`, {
    method: "DELETE",
  });
  return postId;
};

const mapPostFromServer = (post) => {
  return {
     id: post.id,
    title: post.title,
    body: post.body,
    tags: post.tags,
    reactions: post.reactions,
  };
};

export { addPostToServer, getPostsFromServer, deletePostFromServer };

