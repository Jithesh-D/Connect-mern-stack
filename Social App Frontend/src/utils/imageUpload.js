// Utility function to upload profile photo to backend
export const uploadProfilePhoto = async (imageBlob) => {
  try {
    const formData = new FormData();
    formData.append('profilePhoto', imageBlob, 'profile.jpg');

    const response = await fetch('/api/upload/profile-photo', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile photo');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};

// Utility function to convert blob to base64 for preview
export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};