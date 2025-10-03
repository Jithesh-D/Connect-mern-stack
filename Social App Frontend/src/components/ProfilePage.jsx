import { User, Settings, LogOut, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Try both endpoints to see which one works
      let response = await fetch("http://localhost:3001/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      // If /me doesn't work, try /check
      if (!response.ok) {
        response = await fetch("http://localhost:3001/api/auth/check", {
          method: "GET",
          credentials: "include",
        });
      }

      if (response.ok) {
        const data = await response.json();

        if (data.user) {
          setUser(data.user);
        } else if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setError("User not authenticated");
          setTimeout(() => navigate("/login"), 2000);
        }
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        navigate("/login");
      } else {
        setError("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            No user data found. Please log in.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto bg-white min-h-screen">
      {/* Blue Background Section */}
      <div className="bg-gradient-to-b from-blue-400 to-blue-500 px-6 md:px-12 lg:px-16 pb-20 pt-8 md:pt-12 lg:pt-16">
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
            <span className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="bg-white -mt-12 md:-mt-16 lg:-mt-20 rounded-t-3xl px-6 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-2">
            {user.username || "User"}
          </h1>
          <p className="text-blue-600 text-sm md:text-base mb-6 md:mb-8 lg:mb-10">
            RV University Student
          </p>

          {/* Contact Info */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8 mb-8 md:mb-12 lg:mb-16 max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-500 text-sm md:text-base lg:text-lg">
                Email
              </span>
              <span className="text-gray-900 font-medium text-sm md:text-base lg:text-lg">
                {user.email || "No email provided"}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-500 text-sm md:text-base lg:text-lg">
                Username
              </span>
              <span className="text-gray-900 font-medium text-sm md:text-base lg:text-lg">
                @{user.username}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-500 text-sm md:text-base lg:text-lg">
                Member since
              </span>
              <span className="text-gray-900 font-medium text-sm md:text-base lg:text-lg">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1 mt-4 md:mt-6 lg:mt-8 max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 md:gap-4 lg:gap-5 w-full py-4 md:py-5 lg:py-6 text-left hover:bg-red-50 rounded-lg px-4 md:px-5 lg:px-6 border border-gray-100 hover:border-red-200 group"
            >
              <LogOut className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-600 group-hover:text-red-600" />
              <span className="text-gray-900 text-sm md:text-base lg:text-lg group-hover:text-red-600">
                Log out
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
