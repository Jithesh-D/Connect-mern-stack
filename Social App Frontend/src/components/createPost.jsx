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
} from "lucide-react";

const CreatePost = () => {
  const { addPost, editPost } = useContext(PostListData);
  const navigate = useNavigate();
  const location = useLocation();

  const editingPost = location.state?.post || null;

  const postTitleElement = useRef();
  const postBodyElement = useRef();
  const tagsElement = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [titleCount, setTitleCount] = useState(0);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const maxTitleLength = 100;
  const maxBodyLength = 1000;

  useEffect(() => {
    if (editingPost) {
      setIsEditing(true);
      postTitleElement.current.value = editingPost.title;
      postBodyElement.current.value = editingPost.body;
      setTitleCount(editingPost.title.length);
      setCharCount(editingPost.body.length);
      setTags(editingPost.tags || []);
      setTagInput(editingPost.tags?.join(" ") || "");
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
          postTags,
          editingPost.reactions
        );
        editPost(
          updatedPost.id,
          updatedPost.title,
          updatedPost.body,
          updatedPost.tags
        );
      } else {
        const newPost = await addPostToServer(postTitle, postBody, postTags, 0);
        addPost(newPost.id, newPost.title, newPost.body, newPost.tags);
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
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">
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
                <p className="text-blue-100 text-sm">
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
              className="flex items-center text-lg font-semibold text-gray-700"
            >
              <Type className="h-5 w-5 mr-2 text-blue-600" />
              Post Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                ref={postTitleElement}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-lg"
                id="title"
                placeholder="What's on your mind? Make it catchy..."
                maxLength={maxTitleLength}
                onChange={handleTitleChange}
                required
              />
              <div className="absolute right-4 top-4 text-sm text-gray-400">
                {titleCount}/{maxTitleLength}
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
              className="flex items-center text-lg font-semibold text-gray-700"
            >
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Post Content
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <textarea
                ref={postBodyElement}
                rows="6"
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200 text-base resize-none"
                id="body"
                placeholder="Tell us more about it... Share your thoughts, experiences, or ask questions!"
                maxLength={maxBodyLength}
                onChange={handleBodyChange}
                required
              />
              <div className="absolute right-4 bottom-4 text-sm text-gray-400">
                {charCount}/{maxBodyLength}
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
                style={{ width: `${(charCount / maxBodyLength) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Tags Field */}
          <div className="space-y-3">
            <label
              htmlFor="tags"
              className="flex items-center text-lg font-semibold text-gray-700"
            >
              <Hash className="h-5 w-5 mr-2 text-indigo-600" />
              Tags
              <span className="text-gray-400 ml-2 text-sm font-normal">
                (optional)
              </span>
            </label>
            <input
              type="text"
              ref={tagsElement}
              className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200"
              id="tags"
              placeholder="Add tags separated by spaces (e.g., programming student-life campus-events)"
              value={tagInput}
              onChange={handleTagInputChange}
            />

            {/* Tag Preview */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <span className="text-sm font-medium text-gray-600 mr-2">
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
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
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
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Helpful Tips */}
      <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Tips for Great Posts
        </h3>
        <ul className="text-sm text-yellow-700 space-y-2">
          <li>• Write a clear, engaging title that captures attention</li>
          <li>• Share your genuine thoughts and experiences</li>
          <li>• Use relevant tags to help others find your post</li>
          <li>• Be respectful and constructive in your communication</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePost;
