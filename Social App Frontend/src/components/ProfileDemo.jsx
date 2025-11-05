import React, { useState } from 'react';
import ProfilePhotoUpload from './ProfilePhotoUpload';

const ProfileDemo = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handlePhotoUpdate = async (croppedImageBlob, croppedImageUrl) => {
    // Update the profile photo display
    setProfilePhoto(croppedImageUrl);
    
    // Here you would typically upload to your backend
    // const formData = new FormData();
    // formData.append('profilePhoto', croppedImageBlob);
    // await uploadProfilePhoto(formData);
    
    console.log('Cropped image blob:', croppedImageBlob);
    console.log('Cropped image URL:', croppedImageUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Profile Photo</h2>
        
        <ProfilePhotoUpload
          currentPhoto={profilePhoto}
          onPhotoUpdate={handlePhotoUpdate}
        />
        
        <div className="text-center text-gray-600 text-sm">
          Click the camera icon to upload and crop your profile photo
        </div>
      </div>
    </div>
  );
};

export default ProfileDemo;