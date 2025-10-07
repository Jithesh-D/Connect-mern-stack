import { User, Settings, LogOut, Moon, Camera, Edit3 } from "lucide-react";
import { useState, useEffect, useRef, useContext } from "react";
import { PostList as PostListData } from "../store/postListContext.jsx";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { updateAuthor } = useContext(PostListData);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      let response = await fetch("http://localhost:3001/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

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
          setTempUsername(data.user.username);
          // Persist basic user info in sessionStorage for immediate client-side access
          try {
            sessionStorage.setItem(
              "user",
              JSON.stringify({
                id: data.user.id,
                username: data.user.username,
                profileImage: data.user.profileImage || null,
              })
            );
          } catch (e) {
            // ignore storage errors
          }
        } else if (data.authenticated && data.user) {
          setUser(data.user);
          setTempUsername(data.user.username);
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch(
        "http://localhost:3001/api/auth/upload-profile-image",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser((prev) => ({ ...prev, profileImage: data.profileImage }));
        // Update sessionStorage so other components can read the new profile image
        try {
          const stored = JSON.parse(sessionStorage.getItem("user")) || {};
          stored.profileImage = data.profileImage;
          sessionStorage.setItem("user", JSON.stringify(stored));
        } catch (e) {}

        // Update posts authored by this user so their avatar updates immediately
        try {
          updateAuthor({
            userId: user.id,
            username: user.username,
            profileImage: data.profileImage,
          });
        } catch (e) {}

        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!tempUsername.trim()) {
      setError("Username cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username: tempUsername.trim() }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser((prev) => ({ ...prev, username: data.username }));
        // Update sessionStorage and posts
        try {
          const stored = JSON.parse(sessionStorage.getItem("user")) || {};
          stored.username = data.username;
          sessionStorage.setItem("user", JSON.stringify(stored));
        } catch (e) {}

        try {
          updateAuthor({ userId: user.id, username: data.username });
        } catch (e) {}
        setEditMode(false);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update username");
      }
    } catch (err) {
      console.error("Error updating username:", err);
      setError("Failed to update username. Please try again.");
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

  const triggerFileInput = () => {
    // Fixed: Replaced optional chaining with safe check
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const cancelEdit = () => {
    setTempUsername(user?.username || "");
    setEditMode(false);
    setError("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <div className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
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
      <div className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
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
    <div className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Blue Background Section */}
      <div className="bg-gradient-to-b from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700 px-6 md:px-12 lg:px-16 pb-20 pt-8 md:pt-12 lg:pt-16">
        {/* Profile Image with Upload Option */}
        <div className="flex justify-center relative">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg flex items-center justify-center">
              {user.profileImage ? (
                <img
                  src={`http://localhost:3001${user.profileImage}`}
                  alt={user.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    // Fixed: Replaced optional chaining with safe check
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-2xl md:text-3xl lg:text-4xl">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
            </div>

            {/* Camera Icon Overlay */}
            <button
              onClick={triggerFileInput}
              disabled={uploading}
              className="absolute bottom-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors duration-200 group-hover:opacity-100 opacity-90"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Camera className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="text-center mt-4">
            <p className="text-white text-sm">Uploading image...</p>
          </div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="bg-white dark:bg-gray-900 -mt-12 md:-mt-16 lg:-mt-20 rounded-t-3xl px-6 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          {/* Username with Edit Option */}
          <div className="flex items-center justify-center gap-3 mb-2">
            {editMode ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 focus:outline-none text-center"
                  maxLength={50}
                />
                <div className="flex gap-1">
                  <button
                    onClick={handleUsernameUpdate}
                    className="p-1 text-green-600 hover:text-green-700 transition-colors"
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
                  {user.username || "User"}
                </h1>
                <button
                  onClick={() => setEditMode(true)}
                  className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <p className="text-blue-600 dark:text-blue-400 text-sm md:text-base mb-6 md:mb-8 lg:mb-10">
            RV University Student
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8 mb-8 md:mb-12 lg:mb-16 max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-500 dark:text-gray-300 text-sm md:text-base lg:text-lg">
                Email
              </span>
              <span className="text-gray-900 dark:text-white font-medium text-sm md:text-base lg:text-lg">
                {user.email || "No email provided"}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-500 dark:text-gray-300 text-sm md:text-base lg:text-lg">
                Account Type
              </span>
              <span className="text-gray-900 dark:text-white font-medium text-sm md:text-base lg:text-lg">
                {user.loginMethod === "google"
                  ? "Google Account"
                  : "Email Account"}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-500 dark:text-gray-300 text-sm md:text-base lg:text-lg">
                Member since
              </span>
              <span className="text-gray-900 dark:text-white font-medium text-sm md:text-base lg:text-lg">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1 mt-4 md:mt-6 lg:mt-8 max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            {/* <button className="flex items-center gap-3 md:gap-4 lg:gap-5 w-full py-4 md:py-5 lg:py-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-4 md:px-5 lg:px-6 border border-gray-100 dark:border-gray-700 transition-colors">
              <User className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-900 dark:text-white text-sm md:text-base lg:text-lg">
                Account Settings
              </span>
            </button> */}

            {/* <button className="flex items-center gap-3 md:gap-4 lg:gap-5 w-full py-4 md:py-5 lg:py-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-4 md:px-5 lg:px-6 border border-gray-100 dark:border-gray-700 transition-colors">
              <Settings className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-900 dark:text-white text-sm md:text-base lg:text-lg">
                Privacy & Security
              </span>
            </button> */}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 md:gap-4 lg:gap-5 w-full py-4 md:py-5 lg:py-6 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-4 md:px-5 lg:px-6 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-600 group transition-colors"
            >
              <LogOut className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
              <span className="text-gray-900 dark:text-white text-sm md:text-base lg:text-lg group-hover:text-red-600 dark:group-hover:text-red-400">
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
