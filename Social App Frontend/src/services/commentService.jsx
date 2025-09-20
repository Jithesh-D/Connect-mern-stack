import { API_BASE_URL } from "../config";

const handleAuthError = (status) => {
  if (status === 401) {
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  }
};

export const addComment = async (userId, comment) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, comment }),
    });

    if (!response.ok) {
      handleAuthError(response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in addComment:", error);
    throw error;
  }
};

export const getAllComments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments/all`, {
      credentials: "include",
    });

    if (!response.ok) {
      handleAuthError(response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getAllComments:", error);
    throw error;
  }
};
