import { useState, useEffect } from 'react';
import { uploadFiles } from '@/api/mediaApi';

const UploadTestPage = () => {
    const [photos, setPhotos] = useState(null);

  const mutationRegister = useMutation({
    mutationFn: uploadFiles,
    onSuccess: async () => {
      toast.success('User registered successfully');
  
      if (selectedPhotos && selectedPhotos.length > 0) {
        const uploadedPhotos = await uploadFiles('upload-profile', selectedPhotos, false);
        setImgURLs(uploadedPhotos);
      } else {
        console.log("No photos selected or selectedPhotos is undefined");
      }
      nextStep()
    },
    
    onError: (err) => {
      const message = extractBackendError(err);
      toast.error(message);
    },
  });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-10">
            <h1 className="text-3xl font-bold text-center mb-4">📤 Upload Test Page</h1>

            <section className="bg-white p-6 rounded-lg shadow space-y-4">
                <h2 className="text-xl font-semibold">🖼 Upload Photos (Gallery)</h2>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setPhotos(e.target.files)}
                    className="file-input"
                />
                <button
                    onClick={() => uploadFiles('upload-photos', photos, true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Upload Photos
                </button>
            </section>
        </div>
    );
};

export default UploadTestPage;
