import React, { useState, useCallback, useContext, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Camera, Save, X, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { PostList as PostListData } from "../store/postListContext.jsx";

const ProfilePhotoUpload = ({
  currentPhoto,
  onPhotoUpdate,
  userId,
  username,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [profileImage, setProfileImage] = useState(currentPhoto);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const { updateAuthor } = useContext(PostListData);

  useEffect(() => {
    if (currentPhoto) {
      const fullImageUrl = currentPhoto.startsWith("http")
        ? currentPhoto
        : `${import.meta.env.VITE_API_URL}${currentPhoto}`;
      setProfileImage(fullImageUrl);
    } else {
      setProfileImage(null);
    }
  }, [currentPhoto]);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
        setError("");
      };
      reader.onerror = () => {
        setError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.crossOrigin = "anonymous";
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const size = Math.min(pixelCrop.width, pixelCrop.height);
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      size,
      size
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) {
      setError("No image selected for cropping");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Get cropped image as blob
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Create FormData for upload
      const formData = new FormData();
      formData.append("profileImage", croppedImageBlob, "profile.jpg");

      // Upload to backend using axios
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/upload-profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          timeout: 30000, // 30 second timeout
        }
      );

      const { profileImage: newImageUrl } = response.data;

      if (!newImageUrl) {
        throw new Error("No image URL returned from server");
      }

      // Ensure full URL for profile image
      const fullImageUrl = newImageUrl.startsWith("http")
        ? newImageUrl
        : `${import.meta.env.VITE_API_URL}${newImageUrl}`;

      // Update UI immediately
      setProfileImage(fullImageUrl);
      setShowCropper(false);
      setImageSrc(null);

      // Update all posts with new profile photo
      if (updateAuthor && userId && username) {
        updateAuthor({
          userId,
          username,
          profileImage: fullImageUrl,
        });
      }

      // Notify parent component
      onPhotoUpdate?.(fullImageUrl);
    } catch (err) {
      console.error("Upload error:", err);
      let errorMessage = "Failed to upload image. Please try again.";

      if (err.response?.status === 413) {
        errorMessage =
          "Image file is too large. Please choose a smaller image.";
      } else if (err.response?.status === 400) {
        errorMessage =
          "Invalid image format. Please choose a valid image file.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage =
          "Upload timeout. Please check your connection and try again.";
      }

      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setShowCropper(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError("");
  };

  return (
    <div className="relative">
      {/* Profile Photo Display */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 shadow-lg flex items-center justify-center">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setProfileImage(null)}
            />
          ) : (
            <Camera size={32} className="text-gray-400" />
          )}
        </div>

        {/* Upload Button Overlay */}
        <label
          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
            uploading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {uploading ? (
            <Loader2 className="text-white animate-spin" size={24} />
          ) : (
            <Camera className="text-white" size={24} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* Error display below profile photo */}
        {error && (
          <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Cropping Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Crop Profile Photo
              </h3>
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cropper Container */}
            <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  containerStyle: {
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f3f4f6",
                  },
                }}
              />
            </div>

            {/* Zoom Control */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom: {Math.round(zoom * 100)}%
              </label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                disabled={uploading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={uploading || !croppedAreaPixels}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Photo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
