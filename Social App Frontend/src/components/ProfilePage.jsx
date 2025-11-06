import { Camera, Edit3, LogOut, X } from "lucide-react"; // ✅ Added X icon
import { useState, useEffect, useRef, useContext } from "react";
import { PostList as PostListData } from "../store/postListContext.jsx";
import { useNavigate } from "react-router-dom";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { updateAuthor } = useContext(PostListData);

  // Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setTempUsername(data.user.username);
        }
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpdate = (newPhotoUrl) => {
    setUser((prev) => ({ ...prev, profileImage: newPhotoUrl }));
  };

  // ✅ Updated Loading State
  if (loading) {
    return (
      // Use a set height instead of min-h-screen for an inner component
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  // ✅ Updated Error State
  if (error && !user) {
    return (
      <div className="text-center my-20 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
        <p className="text-red-600 dark:text-red-400 mb-4 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // ✅ Handle case where user is null even after load (e.g., auth failure)
  if (!user) {
    return (
      <div className="text-center my-20 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
          Could not load user profile. Please try logging in again.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    // ✅ Main Container: Turned into a responsive card
    <div className="max-w-2xl mx-auto my-8 bg-white dark:bg-gray-900 shadow-xl rounded-lg p-6 sm:p-8">
      {/* Profile Photo Section */}
      <div className="flex justify-center mb-6 relative">
        <ProfilePhotoUpload
          currentPhoto={user?.profileImage}
          onPhotoUpdate={handlePhotoUpdate}
          userId={user?.id}
          username={user?.username}
        />
      </div>

      {/* Username & Edit */}
      <div className="text-center mb-8">
        {editMode ? (
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              // ✅ Styled input for light/dark mode
              className="text-3xl sm:text-4xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none text-center text-gray-900 dark:text-white"
            />
            <button
              onClick={() => setEditMode(false)}
              className="text-gray-500 hover:text-red-500 dark:hover:text-red-400"
            >
              <X className="w-6 h-6" /> {/* ✅ Using X icon */}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {/* ✅ Bigger text, dark/light compatible */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {user.username}
            </h1>
            <button
              onClick={() => setEditMode(true)}
              // ✅ Styled edit button
              className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="space-y-4 max-w-md mx-auto">
        {/* ✅ "Sezzy" Info Box */}
        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Email
          </span>
          <span className="text-md font-semibold text-gray-900 dark:text-white break-all">
            {user.email}
          </span>
        </div>
        {/* ✅ "Sezzy" Info Box */}
        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Account Type
          </span>
          <span className="text-md font-semibold text-gray-900 dark:text-white">
            {user.loginMethod === "google" ? "Google Account" : "Email Account"}
          </span>
        </div>
        {/* ✅ "Sezzy" Info Box */}
        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Member Since
          </span>
          <span className="text-md font-semibold text-gray-900 dark:text-white">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-center">
        {/* ✅ "Sezzy" Logout Button */}
        <button
          onClick={async () => {
            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
              method: "POST",
              credentials: "include",
            });

            window.location.href = "/signup";
          }}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" /> Log out
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
