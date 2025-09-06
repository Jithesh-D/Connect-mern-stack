import React, { useState } from "react";
import { Camera, Settings, Grid, Bookmark, Tag } from "lucide-react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Content - No sidebar/header/footer since they're in MainLayout */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-start space-x-8 mb-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <Camera size={32} className="text-gray-600" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-2xl font-light text-gray-800">suhas_jax</h2>
                <button className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-800 transition-colors">
                  Edit profile
                </button>
                <button className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-800 transition-colors">
                  View archive
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <Settings size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex space-x-8 mb-6">
                <div className="text-center">
                  <div className="font-semibold text-gray-800">0</div>
                  <div className="text-gray-600 text-sm">posts</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800">331</div>
                  <div className="text-gray-600 text-sm">followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800">766</div>
                  <div className="text-gray-600 text-sm">following</div>
                </div>
              </div>

              {/* Bio */}
              <div className="text-gray-800">
                <div className="font-semibold mb-1">Suhas</div>
                <div className="mb-1">Endless Nemesis //</div>
                <div className="text-gray-600">ON MY OWN SPECTRUM</div>
              </div>
            </div>
          </div>

          {/* Story Highlights */}
          <div className="flex items-center space-x-6 mb-8 pb-8 border-b">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-2 hover:border-gray-400 cursor-pointer transition-colors">
                <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <span className="text-2xl text-gray-400 font-light">+</span>
                </div>
              </div>
              <span className="text-xs text-gray-600">New</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-16">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex items-center space-x-2 py-3 border-t-2 ${
                  activeTab === "posts"
                    ? "border-gray-800 text-gray-800"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                } transition-colors`}
              >
                <Grid size={16} />
                <span className="text-sm font-medium uppercase tracking-wide">
                  POSTS
                </span>
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex items-center space-x-2 py-3 border-t-2 ${
                  activeTab === "saved"
                    ? "border-gray-800 text-gray-800"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                } transition-colors`}
              >
                <Bookmark size={16} />
                <span className="text-sm font-medium uppercase tracking-wide">
                  SAVED
                </span>
              </button>
              <button
                onClick={() => setActiveTab("tagged")}
                className={`flex items-center space-x-2 py-3 border-t-2 ${
                  activeTab === "tagged"
                    ? "border-gray-800 text-gray-800"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                } transition-colors`}
              >
                <Tag size={16} />
                <span className="text-sm font-medium uppercase tracking-wide">
                  TAGGED
                </span>
              </button>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full border-2 border-gray-800 flex items-center justify-center mb-6">
              <Camera size={32} className="text-gray-800" />
            </div>
            <h3 className="text-2xl font-light text-gray-800 mb-2">
              Share Photos
            </h3>
            <p className="text-gray-600 text-center mb-6">
              When you share photos, they will appear on your profile.
            </p>
            <button className="text-blue-500 font-medium hover:text-blue-600 transition-colors">
              Share your first photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
