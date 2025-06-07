import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { uploadFiles } from '@/api/mediaApi';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { extractBackendError } from '@/utils/errorUtils';

const UploadTestPage = () => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => uploadFiles('upload-photos', selectedPhotos, true),
    onSuccess: () => {
      toast.success('Photos uploaded successfully!');
      setSelectedPhotos([]);
      setPreviewURLs([]);
      navigate('/home')
    },
    onError: (error) => {
      toast.error(extractBackendError(error));
      console.error(err);
    },
  });

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedPhotos((prev) => [...prev, ...files]);
    setPreviewURLs((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index) => {
    if (window.confirm('Are you sure you want to remove this photo?')) {
      const updatedPhotos = [...selectedPhotos];
      const updatedPreviews = [...previewURLs];
      updatedPhotos.splice(index, 1);
      URL.revokeObjectURL(updatedPreviews[index]);
      updatedPreviews.splice(index, 1);
      setSelectedPhotos(updatedPhotos);
      setPreviewURLs(updatedPreviews);
    }
  };

  const PhotoPreviewCard = ({ url, index }) => (
    <div className="relative group">
      <img
        src={url}
        alt={`Preview ${index}`}
        className="w-full h-32 object-cover rounded-lg shadow-md border group-hover:opacity-80 transition"
      />
      <button
        onClick={() => removePhoto(index)}
        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600 transition"
        title="Remove"
        aria-label={`Remove photo ${index + 1}`}
      >
        <X size={16} />
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden">
      <div
        className="absolute top-6 left-6 text-4xl text-black font-bold z-20 tracking-wide"
        style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}
      >
        TripMate
      </div>
      <h1 className="text-3xl font-bold text-center mt-25">📸 Upload Your Photos</h1>

      <section className="bg-white p-6 rounded-xl shadow border space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />
            <div className="text-gray-600 text-center">
              <span className="block text-lg font-medium">Drag & Drop Photos Here</span>
              <span className="block text-sm">or click to select files</span>
            </div>
          </label>
        </div>

        {previewURLs.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewURLs.map((url, index) => (
              <PhotoPreviewCard key={index} url={url} index={index} />
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => mutation.mutate()}
            disabled={selectedPhotos.length === 0 || mutation.isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
          >
            {mutation.isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Upload Photos'
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default UploadTestPage;
