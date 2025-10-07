import React, { useState, useEffect, useRef } from "react";
import { useDarkMode } from "../store/darkModeContext";
import { useNavigate } from "react-router-dom";
import { addEventToServer } from "../services/eventService";
import {
  Calendar,
  Clock,
  MapPin,
  Type,
  FileText,
  Link,
  MessageCircle,
  Send,
  X,
  Upload,
  Camera,
  Trash2,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

const CreateEvent = () => {
  const navigate = useNavigate();
  const imageInputElement = useRef();

  const [eventData, setEventData] = useState({
    title: "",
    subtitle: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    registrationLink: "",
    whatsappLink: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [dragActive, setDragActive] = useState(false);
  const [titleCount, setTitleCount] = useState(0);
  const [descCount, setDescCount] = useState(0);

  const maxTitleLength = 100;
  const maxDescLength = 500;
  const maxImageSize = 5 * 1024 * 1024; // 5MB
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  // Using global DarkMode context; no local MutationObserver required

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      setTitleCount(value.length);
    }
    if (name === "description") {
      setDescCount(value.length);
    }
  };

  const validateImage = (file) => {
    if (!file) {
      console.log("No file provided");
      return false;
    }

    console.log("Validating file:", {
      type: file.type,
      size: file.size,
      name: file.name,
    });

    const fileType = file.type.toLowerCase();
    if (!allowedImageTypes.includes(fileType)) {
      console.log("Invalid file type:", fileType);
      console.log("Allowed types:", allowedImageTypes);
      alert(
        `Invalid file type: ${fileType}\nPlease select one of these formats: JPEG, PNG, GIF, or WebP`
      );
      return false;
    }

    if (file.size > maxImageSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      alert(`File size (${sizeMB}MB) exceeds the limit of 5MB`);
      return false;
    }

    return true;
  };

  const handleImageSelect = (file) => {
    if (!file) return;

    console.log("Handling file:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    });

    if (validateImage(file)) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      if (imageInputElement.current) {
        imageInputElement.current.value = "";
      }
    }
  };

  const handleImageChange = (e) => {
    console.log("Image change event:", e);
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });
      handleImageSelect(file);
    }
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
    setImage(null);
    setPreview(null);
    if (imageInputElement.current) {
      imageInputElement.current.value = "";
    }
  };

  const triggerImageUpload = () => {
    imageInputElement.current?.click();
  };

  // const handleImageChange = (file) => {
  //   if (file && validateImage(file)) {
  //     setImage(file);
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setPreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting event data:", eventData);
      console.log("Image:", image);

      const formData = new FormData();
      // Add all event data fields
      Object.keys(eventData).forEach((key) => {
        formData.append(key, eventData[key]);
      });

      // Add image if exists
      if (image) {
        formData.append("image", image);
      }

      await addEventToServer(formData);
      navigate("/events");
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event. Please try again: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/events");
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
              ? "bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700"
              : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-7 w-7 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Create New Event
                </h1>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-indigo-200" : "text-indigo-100"
                  }`}
                >
                  Share exciting events with your community
                </p>
              </div>
            </div>
            <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Image Upload Section */}
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
              Event Image
              <span
                className={`ml-2 text-sm font-normal ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                (optional)
              </span>
            </label>

            {!preview ? (
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
                  onChange={(e) => handleImageSelect(e.target.files[0])}
                  accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
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
                    src={preview}
                    alt="Event Preview"
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
              Event Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:bg-gray-600"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white"
                } focus:outline-none`}
                id="title"
                placeholder="Enter event title"
                maxLength={maxTitleLength}
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

          {/* Subtitle Field */}
          <div className="space-y-3">
            <label
              htmlFor="subtitle"
              className={`flex items-center text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <Type
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
              Event Subtitle
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
              name="subtitle"
              value={eventData.subtitle}
              onChange={handleChange}
              className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:bg-gray-600"
                  : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:bg-white"
              } focus:outline-none`}
              id="subtitle"
              placeholder="Enter event subtitle (optional)"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-3">
            <label
              htmlFor="description"
              className={`flex items-center text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <FileText
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              />
              Event Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleChange}
                rows="6"
                className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-base resize-none ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-green-400 focus:bg-gray-600"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:bg-white"
                } focus:outline-none`}
                id="description"
                placeholder="Describe your event in detail"
                maxLength={maxDescLength}
                required
              />
              <div
                className={`absolute right-4 bottom-4 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                {descCount}/{maxDescLength}
              </div>
            </div>
            <div
              className={`h-2 rounded-full overflow-hidden ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-200"
                style={{ width: `${(descCount / maxDescLength) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Date and Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label
                htmlFor="date"
                className={`flex items-center text-lg font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                <Calendar
                  className={`h-5 w-5 mr-2 ${
                    isDarkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
                Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-400 focus:bg-gray-600"
                    : "bg-gray-50 border-gray-200 text-gray-800 focus:border-indigo-500 focus:bg-white"
                } focus:outline-none`}
                required
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="time"
                className={`flex items-center text-lg font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                <Clock
                  className={`h-5 w-5 mr-2 ${
                    isDarkMode ? "text-pink-400" : "text-pink-600"
                  }`}
                />
                Time
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="time"
                name="time"
                value={eventData.time}
                onChange={handleChange}
                className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-pink-400 focus:bg-gray-600"
                    : "bg-gray-50 border-gray-200 text-gray-800 focus:border-pink-500 focus:bg-white"
                } focus:outline-none`}
                required
              />
            </div>
          </div>

          {/* Venue Input */}
          <div className="space-y-3">
            <label
              htmlFor="venue"
              className={`flex items-center text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <MapPin
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}
              />
              Venue
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="venue"
              value={eventData.venue}
              onChange={handleChange}
              className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-red-400 focus:bg-gray-600"
                  : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-red-500 focus:bg-white"
              } focus:outline-none`}
              id="venue"
              placeholder="Enter event venue"
              required
            />
          </div>

          {/* Registration Link */}
          <div className="space-y-3">
            <label
              htmlFor="registrationLink"
              className={`flex items-center text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <Link
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              Registration Link
              <span
                className={`ml-2 text-sm font-normal ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                (optional)
              </span>
            </label>
            <input
              type="url"
              name="registrationLink"
              value={eventData.registrationLink}
              onChange={handleChange}
              className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:bg-gray-600"
                  : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white"
              } focus:outline-none`}
              id="registrationLink"
              placeholder="https://example.com/register"
            />
          </div>

          {/* WhatsApp Link */}
          <div className="space-y-3">
            <label
              htmlFor="whatsappLink"
              className={`flex items-center text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <MessageCircle
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              />
              WhatsApp Group Link
              <span
                className={`ml-2 text-sm font-normal ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                (optional)
              </span>
            </label>
            <input
              type="url"
              name="whatsappLink"
              value={eventData.whatsappLink}
              onChange={handleChange}
              className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-green-400 focus:bg-gray-600"
                  : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:bg-white"
              } focus:outline-none`}
              id="whatsappLink"
              placeholder="https://chat.whatsapp.com/..."
            />
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
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Create Event
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
            ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700/50"
            : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-3 flex items-center ${
            isDarkMode ? "text-blue-300" : "text-blue-800"
          }`}
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Tips for Great Events
        </h3>
        <ul
          className={`text-sm space-y-2 ${
            isDarkMode ? "text-blue-200" : "text-blue-700"
          }`}
        >
          <li>• Choose a clear, descriptive title that captures attention</li>
          <li>• Include high-quality images to showcase your event</li>
          <li>
            • Provide detailed descriptions with all necessary information
          </li>
          <li>• Double-check date, time, and venue details</li>
          <li>• Add registration links to help attendees sign up easily</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateEvent;
