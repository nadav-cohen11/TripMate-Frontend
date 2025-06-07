import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { uploadFiles, deleteFile } from '@/api/mediaApi';
import { toast } from 'react-toastify';
import { extractBackendError } from '@/utils/errorUtils';
import { Spinner } from '@/components/ui/spinner';
import { X, Image, Film } from 'lucide-react';
import { getAllTripsForUser } from '@/api/userApi';

const UploadMediaPage = () => {
  const [mediaType, setMediaType] = useState('photos');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tagParticipants, setTagParticipants] = useState(false);
  const [tripParticipants, setTripParticipants] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { photos, reels } = location.state || { photos: [], reels: [] };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userTrips = await getAllTripsForUser();
        setTrips(userTrips);
      } catch (error) {
        toast.error('Failed to fetch trips');
      }
    };

    if (mediaType === 'reels') {
      fetchTrips();
    }
  }, [mediaType]);

const handleTripChange = async (tripId) => {
  setSelectedTrip(tripId);
  if (tripId) {
    try {
      const userTrips = await getAllTripsForUser(); 
      const selectedTripData = userTrips.find((trip) => trip.tripId === tripId); 
      if (selectedTripData) {
        const participants = selectedTripData.participants || [];
        setTripParticipants(participants);

        const confirmTagging = window.confirm(
          'Do you want to tag participants from this trip in the reel?'
        );
        setTagParticipants(confirmTagging);
      }
    } catch (error) {
      toast.error('Failed to fetch trip participants');
    }
  }
};

  useEffect(() => {
    if (mediaType === 'photos' && location.state?.photos &&
      JSON.stringify(existingMedia) !== JSON.stringify(location.state.photos)) {
      setExistingMedia(location.state.photos);
    } else if (mediaType === 'reels' && location.state?.reels &&
      JSON.stringify(existingMedia) !== JSON.stringify(location.state.reels)) {
      setExistingMedia(location.state.reels);
    }
  }, [location.state, mediaType]);

const uploadMutation = useMutation({
  mutationFn: () => {
    const firstComment = tagParticipants
      ? `Tagged participants: ${tripParticipants
          .map((p) => `${import.meta.env.VITE_FRONTEND_URL}/profile/${p.userId._id}`)
          .join(', ')}` : null;

    return uploadFiles(
      mediaType === 'photos' ? 'upload-photos' : 'upload-reel',
      selectedFiles,
      mediaType === 'photos',
      selectedTrip,
      firstComment
    );
  },
  onSuccess: () => {
    toast.success(
      mediaType === 'photos'
        ? 'Photos uploaded successfully!'
        : 'Reels uploaded successfully!'
    );
    setSelectedFiles([]);
    setPreviewURLs([]);
    setSelectedTrip(null);
    setTagParticipants(false);
    setTripParticipants([]);
    navigate('/home');
  },
  onError: (error) => {
    toast.error(extractBackendError(error));
  },
});

  const deleteMutation = useMutation({
    mutationFn: (mediaId) => deleteFile(mediaId, mediaType),
    onMutate: async (mediaId) => {
      setExistingMedia((prev) => prev.filter((item) => item.public_id !== mediaId));
      return { mediaId };
    },
    onError: (error, mediaId, context) => {
      const errorMsg = extractBackendError(error);
      toast.error(errorMsg || `Failed to delete ${mediaType === 'photos' ? 'photo' : 'reel'}`);

      if (context?.mediaId) {
        setExistingMedia((prev) => {
          if (!prev.some(item => item.public_id === context.mediaId)) {
            return [...prev, { public_id: context.mediaId }];
          }
          return prev;
        });
      }
      console.error('Delete error:', error);
    },
    onSuccess: (_, mediaId) => {
      toast.success(`${mediaType === 'photos' ? 'Photo' : 'Reel'} deleted successfully!`);
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewURLs((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    if (window.confirm(`Are you sure you want to remove this ${mediaType === 'photos' ? 'photo' : 'reel'}?`)) {
      const updatedFiles = [...selectedFiles];
      const updatedPreviews = [...previewURLs];
      updatedFiles.splice(index, 1);
      URL.revokeObjectURL(updatedPreviews[index]);
      updatedPreviews.splice(index, 1);
      setSelectedFiles(updatedFiles);
      setPreviewURLs(updatedPreviews);
    }
  };

  const deleteExistingMedia = (mediaId) => {
    if (window.confirm(`Are you sure you want to delete this ${mediaType === 'photos' ? 'photo' : 'reel'}?`)) {
      deleteMutation.mutate(mediaId);
    }
  };

  const MediaPreviewCard = ({ url, index, isExisting, mediaId, mediaType }) => {
    const isDeleting = deleteMutation.isLoading && deleteMutation.variables === mediaId;
    const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.webm') ||
      (!isExisting && selectedFiles[index] && selectedFiles[index].type && selectedFiles[index].type.includes('video'));

    return (
      <div className="relative group">
        {isVideo ? (
          <video
            src={url}
            className={`w-full h-32 object-cover rounded-lg shadow-md border ${isDeleting ? 'opacity-50' : 'group-hover:opacity-80'} transition`}
            controls
            muted
          />
        ) : (
          <img
            src={url}
            alt={`Preview ${index}`}
            className={`w-full h-32 object-cover rounded-lg shadow-md border ${isDeleting ? 'opacity-50' : 'group-hover:opacity-80'} transition`}
          />
        )}
        {isDeleting ? (
          <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-lg">
            <Spinner size={24} color="text-white" />
          </div>
        ) : (
          <button
            onClick={() => (isExisting ? deleteExistingMedia(mediaId) : removeFile(index))}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600 transition"
            title="Remove"
            aria-label={`Remove ${mediaType === 'photos' ? 'photo' : 'reel'} ${index + 1}`}
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden">
      <div
        className="absolute top-6 left-6 text-4xl text-black font-bold z-20 tracking-wide"
        style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}
      >
        TripMate
      </div>
      {uploadMutation.isLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-all duration-300 animate-fade-in">
          <div className="bg-white/95 p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-sm mx-4">
            <Spinner size={60} color="text-blue-600" speed="animate-spin-slow" />
            <p className="mt-4 text-gray-700 font-medium text-center">
              {mediaType === 'photos' ? 'Uploading your photos...' : 'Uploading your reels...'}
            </p>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Please wait while we process your files
            </p>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-center mt-25">📸 Manage Your Media</h1>

      <div className="flex justify-center mt-6 mb-4">
        <div className="bg-white rounded-full p-1 shadow-md">
          <button
            className={`px-4 py-2 rounded-full flex items-center ${mediaType === 'photos' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => {
              setMediaType('photos');
              setSelectedFiles([]);
              setPreviewURLs([]);
              setSelectedTrip(null);
              if (location.state?.photos) {
                setExistingMedia(location.state.photos);
              } else {
                setExistingMedia([]);
              }
            }}
          >
            <Image size={18} className="mr-2" />
            Photos
          </button>
          <button
            className={`px-4 py-2 rounded-full flex items-center ${mediaType === 'reels' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => {
              setMediaType('reels');
              setSelectedFiles([]);
              setPreviewURLs([]);
              if (location.state?.reels) {
                setExistingMedia(location.state.reels);
              } else {
                setExistingMedia([]);
              }
            }}
          >
            <Film size={18} className="mr-2" />
            Reels
          </button>
        </div>
      </div>

      <section className="bg-white p-6 rounded-xl shadow border space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
          <label
            htmlFor="media-upload"
            className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              id="media-upload"
              type="file"
              accept={mediaType === 'photos' ? "image/*" : "video/*,image/*"}
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-gray-600 text-center">
              <span className="block text-lg font-medium">
                {mediaType === 'photos' ? 'Drag & Drop Photos Here' : 'Drag & Drop Reels Here'}
              </span>
              <span className="block text-sm">or click to select files</span>
            </div>
          </label>
        </div>

        {existingMedia.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">
              Existing {mediaType === 'photos' ? 'Photos' : 'Reels'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingMedia.map((item, index) => (
                <MediaPreviewCard
                  key={item.public_id}
                  url={item.url}
                  index={index}
                  isExisting={true}
                  mediaId={item.public_id}
                  mediaType={mediaType}
                />
              ))}
            </div>
          </div>
        )}

        {previewURLs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">
              New {mediaType === 'photos' ? 'Photos' : 'Reels'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previewURLs.map((url, index) => (
                <MediaPreviewCard
                  key={index}
                  url={url}
                  index={index}
                  isExisting={false}
                  mediaType={mediaType}
                />
              ))}
            </div>
          </div>
        )}

        {mediaType === 'reels' && trips.length > 0 && (
        <div className="mb-4">
          <label htmlFor="trip-select" className="block text-sm font-medium text-gray-700">
            Select Trip
          </label>
          <select
            id="trip-select"
            value={selectedTrip || ''}
            onChange={(e) => handleTripChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>
              Choose a trip
            </option>
            {trips.map((trip) => (
              <option key={trip.tripId} value={trip.tripId}>
                {trip.tripName} - {trip.destination.city}, {trip.destination.country}{' '}
                {trip.travelDates.start
                  ? `(${new Date(trip.travelDates.start).toLocaleDateString()} - ${new Date(
                      trip.travelDates.end
                    ).toLocaleDateString()})`
                  : ''}
              </option>
            ))}
          </select>
        </div>
      )}

        <div className="flex justify-end">
          <button
            onClick={() => uploadMutation.mutate()}
            disabled={
              selectedFiles.length === 0 || 
              uploadMutation.isLoading || 
              (mediaType === 'reels' && !selectedTrip)
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
          >
            {uploadMutation.isLoading ? (
              <>
                <Spinner size={20} color="text-white" />
                <span className="ml-2">Uploading...</span>
              </>
            ) : (
              `Upload ${mediaType === 'photos' ? 'Photos' : 'Reels'}`
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default UploadMediaPage;