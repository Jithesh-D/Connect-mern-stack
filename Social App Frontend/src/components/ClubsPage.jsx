import React, { useState, useEffect } from "react";
import { useDarkMode } from "../store/darkModeContext";
import Post from "./posts";
import Loader from "./loading";
import { getPostsFromServer } from "../services/service";

const ClubsPage = () => {
  const { isDarkMode } = useDarkMode();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClubsPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await getPostsFromServer();
        const clubsPosts = allPosts.filter((post) => post.category === "clubs");
        setPosts(clubsPosts);
      } catch (err) {
        setError("Failed to load clubs posts");
        console.error("Error fetching clubs posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubsPosts();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div
        className={`min-h-screen p-6 ${
          isDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-white"}`}>
      <div className="max-w-2xl mx-auto p-6">
        <div
          className={`mb-6 text-center ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <h1 className="text-2xl font-bold mb-2">Clubs</h1>
          <p className="text-gray-500">Posts from college clubs</p>
        </div>

        {posts.length === 0 ? (
          <div
            className={`text-center py-12 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p className="text-lg mb-4">No club posts yet</p>
            <p className="text-sm">
              Be the first to share something from your club!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsPage;
