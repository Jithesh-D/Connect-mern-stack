import React, { useState } from "react";
import { Link2, Mail, Phone, Sparkles } from "lucide-react";

const AddContribution = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    sourceLinks: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send to an API)
    console.log("Form submitted:", formData);
    // You could show a success message or clear the form
    // setFormData({
    //   projectName: "",
    //   description: "",
    //   sourceLinks: "",
    //   phone: "",
    //   email: "",
    // });
  };

  const isFormValid =
    formData.projectName &&
    formData.description &&
    formData.phone &&
    formData.email;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center font-inter">
      {/* Form Card */}
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          New Contribution
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Share your project or idea with the RVU student community.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Project or Idea Name
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-lg p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <input
                type="text"
                id="projectName"
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
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your project, its goals, and what you're looking for..."
              rows="5"
              className="w-full p-3 rounded-lg resize-none border-2 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400"
              required
            />
          </div>

          {/* Source Links */}
          <div>
            <label
              htmlFor="sourceLinks"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Source Links <span className="text-gray-500">(Optional)</span>
            </label>
            <div className="flex items-start gap-3 border-2 border-gray-300 rounded-lg p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
              <Link2 className="h-5 w-5 text-gray-500 mt-1" />
              <textarea
                id="sourceLinks"
                name="sourceLinks"
                value={formData.sourceLinks}
                onChange={handleInputChange}
                placeholder="GitHub repo, research paper, Figma design, etc. (one per line)"
                rows="2"
                className="flex-1 resize-none bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
              Contact Information
            </h2>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <div className="flex items-center gap-3 border-2 border-gray-300 rounded-lg p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                <Phone className="h-5 w-5 text-gray-500" />
                <input
                  type="tel"
                  id="phone"
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="flex items-center gap-3 border-2 border-gray-300 rounded-lg p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                <Mail className="h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="text-xs text-center p-3 rounded-lg bg-blue-50 text-gray-600">
            Your contribution will be visible to all RVU students and can
            inspire collaborative projects.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300
              ${
                !isFormValid
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
          >
            Submit Contribution
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContribution;
