const API_BASE_URL = "http://localhost:3001/api";

export const commentService = {
  async getComments(postId) {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${postId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch comments: ${response.status} - ${errorText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  async addComment(postId, text) {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to add comment: ${response.status} - ${errorText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  async deleteComment(commentId) {
    try {
      console.log("Deleting comment with ID:", commentId);

      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete error response:", errorText);
        throw new Error(
          `Failed to delete comment: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Delete successful:", result);
      return result;
    } catch (error) {
      console.error("Error deleting comment - Full error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      throw error;
    }
  },
};
