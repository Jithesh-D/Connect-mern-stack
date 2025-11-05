import React, { useState, useRef } from "react";
import { useDarkMode } from "../store/darkModeContext";
import { useNavigate } from "react-router-dom";
import { addEventToServer } from "../services/eventService";
import { Trash2, ArrowLeft, Image, User } from "lucide-react";
import { motion } from "framer-motion";

const CreateEvent = () => {
  const navigate = useNavigate();
  const imageInputElement = useRef();
  const { isDarkMode } = useDarkMode();

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

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [titleCount, setTitleCount] = useState(0);
  const [descCount, setDescCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const maxTitleLength = 100;
  const maxDescLength = 500;
  const maxImageSize = 5 * 1024 * 1024;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));

    if (name === "title") setTitleCount(value.length);
    if (name === "description") setDescCount(value.length);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > maxImageSize) return alert("Max 5MB image allowed");

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleImageChange({ target: { files: e.dataTransfer.files } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(eventData).forEach((key) =>
        formData.append(key, eventData[key])
      );
      if (imageFile) formData.append("image", imageFile);

      await addEventToServer(formData);
      navigate("/events");
    } catch (err) {
      alert("Failed to create event: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
    if (imageInputElement.current) imageInputElement.current.value = "";
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-black" : "bg-gray-50"
      } transition-colors`}
    >
      {/* Top Bar */}
      <div
        className={`border-b ${
          isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/events")}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-900 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              New Event
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.removeItem("eventToken");
                localStorage.removeItem("eventUser");
                navigate("/event-login");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Logout
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isSubmitting
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:shadow-md"
              } ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-black hover:bg-gray-800 text-white"
              }`}
            >
              {isSubmitting ? "Publishing..." : "Share"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sticky Image Upload */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-xl overflow-hidden sticky top-24 ${
                isDarkMode ? "bg-black" : "bg-white"
              } shadow-sm border ${
                isDarkMode ? "border-gray-800" : "border-gray-200"
              }`}
            >
              {!preview ? (
                <motion.div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                  }}
                  onDrop={handleDrop}
                  onClick={() => imageInputElement.current.click()}
                  className={`relative border-2 border-dashed rounded-xl p-20 text-center cursor-pointer transition-all ${
                    dragActive
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-blue-500 bg-blue-50"
                      : isDarkMode
                      ? "border-gray-800 hover:border-gray-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="file"
                    ref={imageInputElement}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <motion.div
                    animate={{ scale: dragActive ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <div
                      className={`p-6 rounded-full ${
                        isDarkMode ? "bg-gray-900" : "bg-gray-100"
                      }`}
                    >
                      <Image
                        className={`h-12 w-12 ${
                          isDarkMode ? "text-gray-600" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-base font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      Drag photos and videos here
                    </p>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg font-medium ${
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      Select from Device
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="relative group">
                  <motion.img
                    src={preview}
                    alt="Preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-[500px] object-cover"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={removeImage}
                    type="button"
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Form Details */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`rounded-xl p-6 space-y-6 ${
                isDarkMode ? "bg-black" : "bg-white"
              } shadow-sm border ${
                isDarkMode ? "border-gray-800" : "border-gray-200"
              } max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent sticky top-24`}
            >
              {/* User Info */}
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

              {/* Event Title */}
              <div>
                <textarea
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  maxLength={maxTitleLength}
                  rows="2"
                  className={`w-full px-0 py-2 text-sm resize-none border-0 focus:ring-0 outline-none transition placeholder-gray-400 ${
                    isDarkMode
                      ? "bg-transparent text-white"
                      : "bg-transparent text-gray-900"
                  }`}
                  placeholder="Event Title *"
                  required
                />
                <p
                  className={`text-xs text-right ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {titleCount}/{maxTitleLength}
                </p>
              </div>

              {/* Subtitle */}
              <div>
                <input
                  type="text"
                  name="subtitle"
                  value={eventData.subtitle}
                  onChange={handleChange}
                  className={`w-full px-0 py-2 text-sm border-0 focus:ring-0 outline-none transition placeholder-gray-400 ${
                    isDarkMode
                      ? "bg-transparent text-white"
                      : "bg-transparent text-gray-900"
                  }`}
                  placeholder="Subtitle (optional)"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  className={`text-xs font-semibold block mb-2 ${
                    isDarkMode ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  DESCRIPTION *
                </label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  rows="4"
                  maxLength={maxDescLength}
                  placeholder="Describe your event..."
                  className={`w-full px-3 py-2 text-sm rounded-lg border resize-none focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    isDarkMode
                      ? "bg-black border-gray-800 text-white placeholder-gray-500 focus:border-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                  required
                />
                <p
                  className={`text-xs text-right mt-1 ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {descCount}/{maxDescLength}
                </p>
              </div>

              {/* Remaining fields (Date, Time, Venue, Registration, WhatsApp) stay unchanged */}
              {/* DATE */}
              <div>
                <label
                  className={`text-xs font-semibold block mb-2 ${
                    isDarkMode ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  DATE *
                </label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    isDarkMode
                      ? "bg-black border-gray-800 text-white focus:border-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>

              {/* TIME */}
              <div>
                <label
                  className={`text-xs font-semibold block mb-2 ${
                    isDarkMode ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  TIME *
                </label>
                <input
                  type="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    isDarkMode
                      ? "bg-black border-gray-800 text-white focus:border-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>

              {/* VENUE */}
              <div>
                <label
                  className={`text-xs font-semibold block mb-2 ${
                    isDarkMode ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  VENUE *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  placeholder="Campus Auditorium"
                  required
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    isDarkMode
                      ? "bg-black border-gray-800 text-white placeholder-gray-500 focus:border-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>

              {/* REGISTRATION LINK */}
              <div>
                <label
                  className={`text-xs font-semibold block mb-2 ${
                    isDarkMode ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  REGISTRATION LINK
                </label>
                <input
                  type="url"
                  name="registrationLink"
                  value={eventData.registrationLink}
                  onChange={handleChange}
                  placeholder="https://example.com/register"
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    isDarkMode
                      ? "bg-black border-gray-800 text-white placeholder-gray-500 focus:border-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>

              {/* WHATSAPP LINK */}
              <div>
                <label
                  className={`text-xs font-semibold block mb-2 ${
                    isDarkMode ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  WHATSAPP LINK
                </label>
                <input
                  type="url"
                  name="whatsappLink"
                  value={eventData.whatsappLink}
                  onChange={handleChange}
                  placeholder="https://chat.whatsapp.com/..."
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    isDarkMode
                      ? "bg-black border-gray-800 text-white placeholder-gray-500 focus:border-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
