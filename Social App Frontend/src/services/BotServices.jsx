import axios from "axios";

const API_URL = "http://localhost:3001/bot"; // change to your backend URL

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/ask`, { message });
    return response.data; // assume { reply: "..." }
  } catch (error) {
    console.error("Bot API error:", error);
    return { reply: "Error connecting to bot." };
  }
};
