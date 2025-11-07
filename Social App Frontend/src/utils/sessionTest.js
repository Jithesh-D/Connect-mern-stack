// Session testing utility for debugging cross-domain auth
import { API_BASE_URL } from "../config";

export const testSession = async () => {
  try {
    console.log("🔍 Testing session with backend:", API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/api/test-session`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    console.log("📊 Session test result:", data);
    
    return data;
  } catch (error) {
    console.error("❌ Session test failed:", error);
    throw error;
  }
};

export const testAuth = async () => {
  try {
    console.log("🔐 Testing auth check with backend:", API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
      method: "GET", 
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    console.log("🔒 Auth test result:", data);
    
    return data;
  } catch (error) {
    console.error("❌ Auth test failed:", error);
    throw error;
  }
};