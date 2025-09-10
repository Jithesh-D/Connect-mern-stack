import { useContext, useRef, useState, useEffect } from "react";
import { PostList as PostListData } from "../store/postListContext";
import { useNavigate, useLocation } from "react-router-dom";
import { addPostToServer, updatePostInServer } from "../services/service.jsx";
import {
  PenTool,
  Type,
  FileText,
  Hash,
  Send,
  Edit3,
  Sparkles,
  X,
  Check,
  Image as ImageIcon,
  Upload,
  Camera,
  Trash2,
} from "lucide-react";

const CreatePost = () => {
  const { addPost, editPost } = useContext(PostListData);
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
  const [titleCount, setTitleCount] = useState(0);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const maxTitleLength = 100;
  const maxBodyLength = 1000;
  const maxImageSize = 5 * 1024 * 1024; // 5MB
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  // Check for dark mode on component mount
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode =
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(darkMode);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (editingPost) {
      setIsEditing(true);
      postTitleElement.current.value = editingPost.title;
      postBodyElement.current.value = editingPost.body;
      setTitleCount(editingPost.title.length);
      setCharCount(editingPost.body.length);
      setTags(editingPost.tags || []);
      setTagInput(editingPost.tags?.join(" ") || "");
      if (editingPost.image) {
        setImagePreview(editingPost.image);
      }
    }
  }, [editingPost]);

  const handleTitleChange = (e) => {
    setTitleCount(e.target.value.length);
  };

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

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setTagInput(updatedTags.join(" "));
    tagsElement.current.value = updatedTags.join(" ");
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

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputElement.current) {
      imageInputElement.current.value = "";
    }
  };

  const triggerImageUpload = () => {
    imageInputElement.current?.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const postTitle = postTitleElement.current.value;
    const postBody = postBodyElement.current.value;
    const postTags = tags;

    // Validation
    if (!postTitle.trim() || !postBody.trim()) {
      alert("Please fill in both title and content fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        const updatedPost = await updatePostInServer(
          editingPost.id,
          postTitle,
          postBody,
          postTags
        );
        editPost(
          updatedPost.id,
          updatedPost.title,
          updatedPost.body,
          updatedPost.tags,
          updatedPost.image
        );
      } else {
        const newPost = await addPostToServer(
          postTitle,
          postBody,
          postTags,
          selectedImage // Pass the actual File object
        );
        addPost(
          newPost.id,
          newPost.title,
          newPost.body,
          newPost.tags,
          newPost.image
        );
      }

      navigate("/");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div
        className={`rounded-2xl shadow-xl border overflow-hidden ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        {/* Header */}
        <div
          className={`px-8 py-6 ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700"
              : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <Edit3 className="h-7 w-7 text-white" />
              ) : (
                <PenTool className="h-7 w-7 text-white" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isEditing ? "Edit Your Post" : "Create New Post"}
                </h1>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-blue-200" : "text-blue-100"
                  }`}
                >
                  {isEditing
                    ? "Update your thoughts"
                    : "Share your thoughts with the campus community"}
                </p>
              </div>
            </div>
            <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Title Field */}
          <div className="space-y-3">
            <label
              htmlFor="title"
              className={`flex items-center text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <Type
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              Post Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                ref={postTitleElement}
                className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:bg-gray-600"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white"
                } focus:outline-none`}
                id="title"
                placeholder="What's on your mind? Make it catchy..."
                maxLength={maxTitleLength}
                onChange={handleTitleChange}
                required
              />
              <div
                className={`absolute right-4 top-4 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                {titleCount}/{maxTitleLength}
              </div>
            </div>
            <div
              className={`h-2 rounded-full overflow-hidden ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-200"
                style={{ width: `${(titleCount / maxTitleLength) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Content Field */}
          <div className="space-y-3">
            <label
              htmlFor="body"
              className={`flex items-center text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <FileText
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
              Post Content
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <textarea
                ref={postBodyElement}
                rows="6"
                className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-base resize-none ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:bg-gray-600"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:bg-white"
                } focus:outline-none`}
                id="body"
                placeholder="Tell us more about it... Share your thoughts, experiences, or ask questions!"
                maxLength={maxBodyLength}
                onChange={handleBodyChange}
                required
              />
              <div
                className={`absolute right-4 bottom-4 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                {charCount}/{maxBodyLength}
              </div>
            </div>
            <div
              className={`h-2 rounded-full overflow-hidden ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
                style={{ width: `${(charCount / maxBodyLength) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Image Upload Field */}
          <div className="space-y-3">
            <label
              className={`flex items-center text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <ImageIcon
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              />
              Add Image
              <span
                className={`ml-2 text-sm font-normal ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                (optional)
              </span>
            </label>

            {!imagePreview ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  dragActive
                    ? isDarkMode
                      ? "border-green-400 bg-green-900/20"
                      : "border-green-500 bg-green-50"
                    : isDarkMode
                    ? "border-gray-600 hover:border-green-400 hover:bg-gray-700/50"
                    : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
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
                      isDarkMode ? "bg-green-900/30" : "bg-green-100"
                    }`}
                  >
                    <Upload
                      className={`h-8 w-8 ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-lg font-medium ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Drop an image here or click to browse
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Supports JPEG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? "bg-green-600 hover:bg-green-500 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div
                  className={`relative rounded-xl overflow-hidden border ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="opacity-0 hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-opacity duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Tags Field */}
          <div className="space-y-3">
            <label
              htmlFor="tags"
              className={`flex items-center text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <Hash
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              Tags
              <span
                className={`ml-2 text-sm font-normal ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                (optional)
              </span>
            </label>
            <input
              type="text"
              ref={tagsElement}
              className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-400 focus:bg-gray-600"
                  : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:bg-white"
              } focus:outline-none`}
              id="tags"
              placeholder="Add tags separated by spaces (e.g., programming student-life campus-events)"
              value={tagInput}
              onChange={handleTagInputChange}
            />

            {/* Tag Preview */}
            {tags.length > 0 && (
              <div
                className={`flex flex-wrap gap-2 p-4 rounded-xl border ${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50"
                    : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100"
                }`}
              >
                <span
                  className={`text-sm font-medium mr-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Preview:
                </span>
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 pt-6 border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 inline-flex items-center justify-center px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  {isEditing ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  {isEditing ? (
                    <Check className="h-5 w-5 mr-2" />
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  {isEditing ? "Update Post" : "Publish Post"}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 border-2 ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 hover:border-gray-500"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Helpful Tips */}
      <div
        className={`mt-8 border rounded-xl p-6 ${
          isDarkMode
            ? "bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-700/50"
            : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-3 flex items-center ${
            isDarkMode ? "text-yellow-300" : "text-yellow-800"
          }`}
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Tips for Great Posts
        </h3>
        <ul
          className={`text-sm space-y-2 ${
            isDarkMode ? "text-yellow-200" : "text-yellow-700"
          }`}
        >
          <li>• Write a clear, engaging title that captures attention</li>
          <li>• Share your genuine thoughts and experiences</li>
          <li>• Use high-quality images to make your post more engaging</li>
          <li>• Use relevant tags to help others find your post</li>
          <li>• Be respectful and constructive in your communication</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePost;
