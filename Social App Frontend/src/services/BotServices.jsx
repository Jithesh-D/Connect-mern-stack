import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });

    if (error.code === "ECONNREFUSED") {
      throw new Error(
        "Cannot connect to server. Make sure backend is running on port 3001."
      );
    } else if (error.response?.status === 404) {
      throw new Error("Service endpoint not found.");
    } else if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    } else {
      throw new Error(
        error.response?.data?.error || error.message || "Network error occurred"
      );
    }
  }
);

export const sendMessage = async (message) => {
  try {
    console.log("📨 Sending message to chatbot:", message);

    const response = await api.post("/api/bot/ask", {
      message,
    });

    console.log("✅ Chatbot response received");

    if (response.data.success) {
      return response.data.response;
    } else {
      throw new Error(response.data.error || "Unknown error from server");
    }
  } catch (error) {
    console.error("💥 Error in sendMessage:", error);
    throw error;
  }
};

export const testBackendConnection = async () => {
  try {
    const response = await api.get("/api/health");
    return {
      connected: true,
      data: response.data,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
};

export const testGeminiConnection = async () => {
  try {
    const response = await api.get("/api/test");
    return {
      connected: true,
      data: response.data,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
};
