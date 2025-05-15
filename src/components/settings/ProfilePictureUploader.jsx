import React from 'react';
import { toast } from 'sonner';

const ProfilePictureUploader = ({ imgURL, setImgURL }) => {
  const onFile = (e) => {
    try {
      const f = e.target.files[0];
      if (f) {
        if (f.size > 5 * 1024 * 1024) { 
          toast.error("File size should be less than 5MB");
          return;
        }
        if (!f.type.startsWith('image/')) {
          toast.error("Please upload an image file");
          return;
        }
        setImgURL(URL.createObjectURL(f));
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("An error occurred while uploading the file");
    }
  };

  return (
    <section className="flex flex-col items-center gap-4">
      <div className="h-28 w-28 rounded-full bg-gray-300 overflow-hidden bg-white border border-gray-300 rounded-lg shadow-sm">
        {imgURL && (
          <img
            src={imgURL}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <label className="text-sm text-indigo-600 underline cursor-pointer">
        Upload profile picture
        <input type="file" accept="image/*" onChange={onFile} className="sr-only" />
      </label>
    </section>
  );
};

export default ProfilePictureUploader; 