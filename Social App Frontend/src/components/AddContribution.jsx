import React, { useState } from "react";
import { Link2, Mail, Phone, Sparkles, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addContribution } from "../services/collabservice";

const AddContribution = () => {
  const navigate = useNavigate();

  const sessionUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch (e) {
      return null;
    }
  })();
  const currentUserEmail = sessionUser?.email || "";

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    sourceLinks: "",
    phone: "",
    email: currentUserEmail,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addContribution(formData);
      localStorage.setItem("userEmail", formData.email);
      setSuccess(true);
      setFormData({
        projectName: "",
        description: "",
        sourceLinks: "",
        phone: "",
        email: currentUserEmail,
      });
      setTimeout(() => navigate("/contribution"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.projectName &&
    formData.description &&
    formData.phone &&
    formData.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-10">
      {/* Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Top Gradient Bar */}
        <div className="w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />

        {/* Main Content */}
        <div className="p-10">
          {/* Title */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <Lightbulb className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Contribution
            </h1>
          </div>
          <p className="text-gray-500 text-center mb-8 text-sm">
            Share your innovative project idea and collaborate with RVU peers.
          </p>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Contribution submitted successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project or Idea Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-400 transition-all">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="e.g., AI-Powered Study App"
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project, goals, and potential impact..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none placeholder:text-gray-400"
                required
              />
            </div>

            {/* Source Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Links{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <div className="flex items-start gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-purple-400 transition-all">
                <Link2 className="h-5 w-5 text-gray-400 mt-1" />
                <textarea
                  name="sourceLinks"
                  value={formData.sourceLinks}
                  onChange={handleInputChange}
                  placeholder="Add GitHub, Figma, or reference links..."
                  rows="2"
                  className="flex-1 bg-transparent outline-none placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="pt-4 border-t border-gray-200 space-y-5">
              <h2 className="text-sm font-semibold uppercase text-gray-600 tracking-wide">
                Contact Information
              </h2>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-400 transition-all">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="flex-1 bg-transparent outline-none text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="text-xs text-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 text-gray-600 border border-purple-100">
              Your contribution will be visible to all RVU students and can
              spark new collaborations.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                !isFormValid || loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Submitting..." : "Submit Contribution"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContribution;
