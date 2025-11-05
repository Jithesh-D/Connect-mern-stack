import React, { useState } from "react";
import { X, Sparkles, Link2, Phone } from "lucide-react";

const EditContributionModal = ({ contribution, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    projectName: contribution.projectName,
    description: contribution.description,
    sourceLinks: contribution.sourceLinks || "",
    phone: contribution.phone,
    email: contribution.email,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error updating contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Edit Contribution</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-lg p-3 focus-within:border-purple-500">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Links
            </label>
            <div className="flex items-start gap-3 border-2 border-gray-300 rounded-lg p-3 focus-within:border-purple-500">
              <Link2 className="h-5 w-5 text-gray-500 mt-1" />
              <textarea
                name="sourceLinks"
                value={formData.sourceLinks}
                onChange={handleChange}
                rows="2"
                className="flex-1 bg-transparent outline-none resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-lg p-3 focus-within:border-purple-500">
              <Phone className="h-5 w-5 text-gray-500" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContributionModal;