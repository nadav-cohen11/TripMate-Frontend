import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { uploadFiles, deleteFile, uploadToInstagram } from '@/api/mediaApi';
import { toast } from 'react-toastify';
import { extractBackendError } from '@/utils/errorUtils';
import { Spinner } from '@/components/ui/spinner';
import { Image, Film, Upload, Trash2, Users, X } from 'lucide-react';
import { getAllTripsForUser } from '@/api/userApi';
import { getUserById } from '@/api/userApi';
import { useAuth } from '@/context/AuthContext';
import { FaInstagram } from 'react-icons/fa';
import { confirmToast } from '@/components/ui/ToastConfirm';

const UploadMediaPage = () => {
  const [mediaType, setMediaType] = useState('photos');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tagParticipants, setTagParticipants] = useState(false);
  const [tripParticipants, setTripParticipants] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const refetchUserMedia = async () => {
    try {
      const userData = await getUserById(user);
      if (mediaType === 'photos') {
        setExistingMedia(userData.photos || []);
      } else {
        setExistingMedia(userData.reels || []);
      }
    } catch (err) {
      toast.error('Failed to refetch media');
    }
  };

  const handleTripChange = async (tripId) => {
    setSelectedTrip(tripId);
    if (tripId) {
      try {
        const userTrips = await getAllTripsForUser();
        const selectedTripData = userTrips.find(
          (trip) => trip.tripId === tripId,
        );
        if (selectedTripData) {
          const participants = selectedTripData.participants || [];
          setTripParticipants(participants);

          toast.info(
            <div>
              <span>
                Do you want to tag participants from this trip in the reel?
              </span>
              <div className='mt-2 flex gap-2'>
                <button
                  onClick={() => {
                    setTagParticipants(true);
                    toast.dismiss();
                  }}
                  className='px-3 py-1 bg-blue-600 text-white rounded'
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setTagParticipants(false);
                    toast.dismiss();
                  }}
                  className='px-3 py-1 bg-gray-300 rounded'
                >
                  No
                </button>
              </div>
            </div>,
            { autoClose: false, closeOnClick: false },
          );
        }
      } catch (error) {
        toast.error('Failed to fetch trip participants');
      }
    }
  };

  useEffect(() => {
    refetchUserMedia();
  }, [mediaType]);

  const uploadMutation = useMutation({
    mutationFn: () => {
      const firstComment = tagParticipants
        ? `Tagged participants: ${tripParticipants
            .map(
              (p) =>
                `${import.meta.env.VITE_FRONTEND_URL}/profile/${p.userId._id}`,
            )
            .join(', ')}`
        : null;

      return uploadFiles(
        mediaType === 'photos' ? 'upload-photos' : 'upload-reel',
        selectedFiles,
        mediaType === 'photos',
        selectedTrip,
        firstComment,
      );
    },
    onSuccess: () => {
      toast.success(
        mediaType === 'photos'
          ? 'Photos uploaded successfully!'
          : 'Reels uploaded successfully!',
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
      setExistingMedia((prev) =>
        prev.filter((item) => item.public_id !== mediaId),
      );
      return { mediaId };
    },
    onError: (error, mediaId, context) => {
      const errorMsg = extractBackendError(error);
      toast.error(
        errorMsg ||
          `Failed to delete ${mediaType === 'photos' ? 'photo' : 'reel'}`,
      );

      if (context?.mediaId) {
        setExistingMedia((prev) => {
          if (!prev.some((item) => item.public_id === context.mediaId)) {
            return [...prev, { public_id: context.mediaId }];
          }
          return prev;
        });
      }
      console.error('Delete error:', error);
    },
    onSuccess: async () => {
      toast.success(
        `${mediaType === 'photos' ? 'Photo' : 'Reel'} deleted successfully!`,
      );
      await refetchUserMedia();
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewURLs((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    toast.info(
      <div>
        <span>
          Are you sure you want to remove this{' '}
          {mediaType === 'photos' ? 'photo' : 'reel'}?
        </span>
        <div className='mt-2 flex gap-2'>
          <button
            onClick={() => {
              const updatedFiles = [...selectedFiles];
              const updatedPreviews = [...previewURLs];
              updatedFiles.splice(index, 1);
              URL.revokeObjectURL(updatedPreviews[index]);
              updatedPreviews.splice(index, 1);
              setSelectedFiles(updatedFiles);
              setPreviewURLs(updatedPreviews);
              toast.dismiss();
              toast.success(
                `${mediaType === 'photos' ? 'Photo' : 'Reel'} removed`,
              );
            }}
            className='px-3 py-1 bg-red-600 text-white rounded'
          >
            Remove
          </button>
          <button
            onClick={() => toast.dismiss()}
            className='px-3 py-1 bg-gray-300 rounded'
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false },
    );
  };

  const deleteExistingMedia = async (mediaId) => {
    const confirm = await confirmToast(
      `Are you sure you want to delete this ${
        mediaType === 'photos' ? 'photo' : 'reel'
      }?`,
      'red',
    );
    if (confirm) {
      deleteMutation.mutate(mediaId);
    }
  };

  const instagramMutation = useMutation({
    mutationFn: (mediaUrl) => uploadToInstagram(mediaUrl),
    onSuccess: () => {
      toast.success('Photo uploaded successfully');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  const uploadImgToInstagram = async (mediaUrl) => {
    const confirm = await confirmToast(
      `Are you sure you want to upload this image to our instagram?`,
    );
    if (!confirm) return;
    instagramMutation.mutate(mediaUrl);
  };

  const MediaPreviewCard = ({ url, index, isExisting, mediaId, mediaType }) => {
    const isDeleting =
      deleteMutation.isLoading && deleteMutation.variables === mediaId;
    const isVideo =
      url.includes('.mp4') ||
      url.includes('.mov') ||
      url.includes('.webm') ||
      (!isExisting &&
        selectedFiles[index] &&
        selectedFiles[index].type &&
        selectedFiles[index].type.includes('video'));

    return (
      <div className='relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300'>
        {isVideo ? (
          <video
            src={url}
            className={`w-full h-48 object-cover ${
              isDeleting ? 'opacity-50' : 'group-hover:opacity-90'
            } transition-all duration-300`}
            controls
            muted
          />
        ) : (
          <img
            src={url}
            alt={`Preview ${index}`}
            className={`w-full h-48 object-cover ${
              isDeleting ? 'opacity-50' : 'group-hover:opacity-90'
            } transition-all duration-300`}
          />
        )}
        {isDeleting ? (
          <div className='absolute inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm'>
            <Spinner size={24} color='text-white' />
          </div>
        ) : (
          <div className='absolute top-2 left-2 right-2 flex flex-row justify-between items-center px-2'>
            <button
              onClick={() =>
                isExisting ? deleteExistingMedia(mediaId) : removeFile(index)
              }
              className='bg-black/60 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300 transform hover:scale-110'
              title='Remove'
              aria-label={`Remove ${
                mediaType === 'photos' ? 'photo' : 'reel'
              } ${index + 1}`}
            >
              <Trash2 size={16} />
            </button>

            {url.includes('image') && (
              <button
                onClick={() => uploadImgToInstagram(url)}
                className='bg-black/60 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300 transform hover:scale-110'
                title='Upload'
                aria-label={`Upload ${
                  mediaType === 'photos' ? 'photo' : 'reel'
                } ${index + 1}`}
              >
                <FaInstagram />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 py-4 sm:py-8 md:py-12 px-4 flex items-center justify-center'>
      <div className='w-full max-w-[420px] bg-white rounded-3xl shadow-xl relative'>
        <button
          onClick={() => navigate('/home')}
          className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-gray-600 z-50"
          aria-label="Skip to home"
        >
          <X className="w-4 h-4" />
        </button>

        <div className='p-6 space-y-6'>
          <div className='text-center'>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className='text-lg font-semibold text-gray-800'>
                Photo Gallery
              </h1>
              <Image className="w-5 h-5 text-gray-700" />
            </div>
            <p className='text-sm text-gray-500'>
              Share your favorite moments from your trips
            </p>
          </div>

          <div className='flex justify-center'>
            <div className='bg-gray-50 rounded-xl p-1 inline-flex gap-1 w-full max-w-[240px]'>
              <button
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 ${
                  mediaType === 'photos'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setMediaType('photos');
                  setSelectedFiles([]);
                  setPreviewURLs([]);
                  setSelectedTrip(null);
                  refetchUserMedia();
                }}
              >
                <Image size={16} />
                Photos
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 ${
                  mediaType === 'reels'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setMediaType('reels');
                  setSelectedFiles([]);
                  setPreviewURLs([]);
                  refetchUserMedia();
                }}
              >
                <Film size={16} />
                Reels
              </button>
            </div>
          </div>

          <div className='space-y-6'>
            <label
              htmlFor='media-upload'
              className='flex flex-col items-center justify-center w-full aspect-[3/2] border border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-all duration-300 hover:border-blue-300'
            >
              <input
                id='media-upload'
                type='file'
                accept={mediaType === 'photos' ? 'image/*' : 'video/*,image/*'}
                multiple
                onChange={handleFileChange}
                className='hidden'
              />
              <div className='text-center'>
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Upload size={20} className='text-gray-400' />
                </div>
                <span className='block text-sm font-medium text-gray-700'>
                  Drop your {mediaType} here
                </span>
                <span className='block text-xs text-gray-400 mt-1'>
                  or click to browse files
                </span>
              </div>
            </label>

            {existingMedia.length > 0 && (
              <div className='space-y-3'>
                <h2 className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                  <Users size={16} />
                  Existing {mediaType === 'photos' ? 'Photos' : 'Reels'}
                </h2>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
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
              <div className='space-y-3'>
                <h2 className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                  <Upload size={16} />
                  New {mediaType === 'photos' ? 'Photos' : 'Reels'}
                </h2>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
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
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Select Trip
                </label>
                <select
                  value={selectedTrip || ''}
                  onChange={(e) => handleTripChange(e.target.value)}
                  className='w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-300'
                >
                  <option value='' disabled>
                    Choose a trip
                  </option>
                  {trips.map((trip) => (
                    <option key={trip.tripId} value={trip.tripId}>
                      {trip.tripName} - {trip.destination.city},{' '}
                      {trip.destination.country}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className='flex justify-center pt-2'>
              <button
                onClick={() => uploadMutation.mutate()}
                disabled={
                  selectedFiles.length === 0 ||
                  uploadMutation.isLoading ||
                  (mediaType === 'reels' && !selectedTrip)
                }
                className='w-full max-w-[200px] px-4 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2'
              >
                {uploadMutation.isLoading ? (
                  <>
                    <Spinner size={16} color='text-white' />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Upload {mediaType}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {uploadMutation.isLoading && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center'>
          <div className='bg-white/95 p-6 rounded-xl shadow-xl flex flex-col items-center max-w-sm mx-4'>
            <Spinner size={40} color='text-blue-500' />
            <p className='mt-4 text-gray-800 font-medium text-sm'>
              Uploading your {mediaType}...
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              Please wait while we process your files
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMediaPage;
