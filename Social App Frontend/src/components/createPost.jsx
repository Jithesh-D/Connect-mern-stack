import { useContext, useRef, useState, useEffect } from "react";
import { useDarkMode } from "../store/darkModeContext";
import { PostList as PostListData } from "../store/postListContext";
import { useNavigate, useLocation } from "react-router-dom";
import { addPostToServer, updatePostInServer } from "../services/service.jsx";
import {
  ArrowLeft,
  Image as ImageIcon,
  ChevronRight,
  ChevronDown,
  User,
} from "lucide-react";

const CreatePost = () => {
  const { addPost, editPost, updatePost } = useContext(PostListData);
  const navigate = useNavigate();
  const location = useLocation();

  const editingPost = location.state?.post || null;

  const postTitleElement = useRef();
  const postBodyElement = useRef();
  const tagsElement = useRef();
  const imageInputElement = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const { isDarkMode } = useDarkMode();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCurrentUser(parsed);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  }, []);

  const maxBodyLength = 2200;
  const maxImageSize = 5 * 1024 * 1024;
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const categories = [
    { value: "general", label: "General" },
    { value: "clubs", label: "Clubs" },
  ];

  useEffect(() => {
    if (editingPost) {
      setIsEditing(true);
      setTitle(editingPost.title);
      postBodyElement.current.value = editingPost.body;
      setCharCount(editingPost.body.length);
      setTags(editingPost.tags || []);
      setTagInput(editingPost.tags?.join(" ") || "");
      setCategory(editingPost.category || "general");
      if (editingPost.image) {
        setImagePreview(editingPost.image);
      }
    }
  }, [editingPost]);

  const handleBodyChange = (e) => {
    setCharCount(e.target.value.length);
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
    const newTags = e.target.value
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);
    setTags(newTags);
  };

  const validateImage = (file) => {
    if (!allowedImageTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return false;
    }
    if (file.size > maxImageSize) {
      alert("Image size should be less than 5MB");
      return false;
    }
    return true;
  };

  const handleImageSelect = (file) => {
    if (file && validateImage(file)) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const triggerImageUpload = () => {
    imageInputElement.current?.click();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const postTitle = title;
    const postBody = postBodyElement.current.value;
    const postTags = tags;

    if (!postBody.trim()) {
      alert("Please write a caption.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        const updatedPost = await updatePostInServer(
          editingPost.id,
          postTitle,
          postBody,
          postTags,
          category
        );
        try {
          const sessionUser = JSON.parse(sessionStorage.getItem("user")) || {};
          if (!updatedPost.author || !updatedPost.author.id) {
            updatedPost.author = {
              id: sessionUser.id || sessionUser._id || null,
              username: sessionUser.username || sessionUser.name || "You",
              profileImage: sessionUser.profileImage || null,
            };
          }
        } catch (e) {}
        updatePost(updatedPost);
      } else {
        const newPost = await addPostToServer(
          postTitle,
          postBody,
          postTags,
          selectedImage,
          category
        );
        try {
          const sessionUser = JSON.parse(sessionStorage.getItem("user")) || {};
          if (!newPost.author || !newPost.author.id) {
            newPost.author = {
              id: sessionUser.id || sessionUser._id || null,
              username: sessionUser.username || sessionUser.name || "You",
              profileImage: sessionUser.profileImage || null,
            };
          }
        } catch (e) {}
        addPost(newPost);
      }

      navigate("/");
    } catch (error) {
      console.error("Error saving post:", error);
      alert(error.message || "Failed to save post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-white"}`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <button
          onClick={handleCancel}
          className={`p-2 ${isDarkMode ? "text-white" : "text-black"}`}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1
          className={`text-base font-semibold ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          New post
        </h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold text-white ${
            isSubmitting ? "bg-gray-600" : "bg-black"
          }`}
        >
          {isSubmitting ? "Sharing..." : "Share"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left side - Image upload */}
        <div
          className={`flex-1 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r ${
            isDarkMode ? "border-gray-800 bg-black" : "border-gray-200 bg-white"
          }`}
        >
          {!imagePreview ? (
            <div
              className={`w-full max-w-md text-center cursor-pointer ${
                dragActive ? "opacity-70" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerImageUpload}
            >
              <input
                type="file"
                ref={imageInputElement}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`p-4 rounded-full ${
                    isDarkMode ? "bg-gray-900" : "bg-gray-100"
                  }`}
                >
                  <ImageIcon
                    className={`h-12 w-12 ${
                      isDarkMode ? "text-white" : "text-gray-600"
                    }`}
                  />
                </div>
                <p
                  className={`text-xl ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Drag photos and videos here
                </p>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    isDarkMode
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Select from Device
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto max-h-[600px] object-contain"
              />
            </div>
          )}
        </div>

        {/* Right side - Caption and details */}
        <div
          className={`w-full md:w-96 flex flex-col ${
            isDarkMode ? "bg-black" : "bg-white"
          }`}
        >
          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span
              className={`font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {currentUser?.username || currentUser?.name || "You"}
            </span>
          </div>
          <div
            className={`w-10 h-10 flex items-center justify-center bg-white`}
          >
            <span
              className={`font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            ></span>
          </div>

          {/* Caption textarea */}
          <div className="px-4 py-2">
            <textarea
              ref={postBodyElement}
              rows="8"
              className={`w-full resize-none border-none focus:outline-none text-sm ${
                isDarkMode
                  ? "bg-black text-white placeholder-gray-500"
                  : "bg-white text-black placeholder-gray-400"
              }`}
              placeholder="Write a caption..."
              maxLength={maxBodyLength}
              onChange={handleBodyChange}
            />
            <div
              className={`text-xs text-right mt-1 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {charCount}/{maxBodyLength}
            </div>
          </div>

          {/* Options */}
          <div className="mt-auto">
            <button
              onClick={() => setShowTitleModal(true)}
              className={`w-full flex items-center justify-between px-4 py-3 border-t ${
                isDarkMode
                  ? "border-gray-800 text-white hover:bg-gray-900"
                  : "border-gray-200 text-black hover:bg-gray-50"
              }`}
            >
              <span className="text-sm">Add title</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowCategoryModal(true)}
              className={`w-full flex items-center justify-between px-4 py-3 border-t ${
                isDarkMode
                  ? "border-gray-800 text-white hover:bg-gray-900"
                  : "border-gray-200 text-black hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-sm">Category</span>
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {categories.find((cat) => cat.value === category)?.label ||
                    "General"}
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowTagsModal(true)}
              className={`w-full flex items-center justify-between px-4 py-3 border-t ${
                isDarkMode
                  ? "border-gray-800 text-white hover:bg-gray-900"
                  : "border-gray-200 text-black hover:bg-gray-50"
              }`}
            >
              <span className="text-sm">Tags</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Title Modal */}
      {showTitleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-md rounded-xl ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="p-4 border-b border-gray-700">
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Add Title
              </h2>
            </div>
            <div className="p-4">
              <input
                ref={postTitleElement}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                    : "bg-white border-gray-300 text-black focus:ring-blue-500"
                }`}
              />
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end space-x-2">
              <button
                onClick={() => setShowTitleModal(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTitleModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-md rounded-xl ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="p-4 border-b border-gray-700">
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Select Category
              </h2>
            </div>
            <div className="p-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setCategory(cat.value);
                    setShowCategoryModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                    category === cat.value
                      ? isDarkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : isDarkMode
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cat.label}</span>
                    {category === cat.value && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tags Modal */}
      {showTagsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-md rounded-xl ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="p-4 border-b border-gray-700">
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Add Tags
              </h2>
            </div>
            <div className="p-4">
              <input
                ref={tagsElement}
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                placeholder="Enter tags separated by spaces..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                    : "bg-white border-gray-300 text-black focus:ring-blue-500"
                }`}
              />
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end space-x-2">
              <button
                onClick={() => setShowTagsModal(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTagsModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
