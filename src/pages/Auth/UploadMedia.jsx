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
import TripMateTitle from '@/components/ui/TripMateTitle';

const UploadMediaPage = ({ register = false }) => {
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
      if (!register) {
      const userData = await getUserById(user);
      if (mediaType === 'photos') {
        setExistingMedia(userData.photos || []);
        } else {
          setExistingMedia(userData.reels || []);
        }
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

          const confirm = await confirmToast(
            'Do you want to tag participants from this trip in the reel?',
          );
          if (confirm) {
            setTagParticipants(true);
          } else {
            setTagParticipants(false);
          }
        }
      } catch (error) {
        toast.error('Failed to fetch trip participants');
      }
    }
  };

  useEffect(() => {
    if (!register) refetchUserMedia();
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
      navigate(`/profile/${user}`);
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
    <div className='min-h-screen bg-[#f8faff] py-2 sm:py-4 md:py-8 px-1 sm:px-4 flex items-center justify-center pb-32 md:pb-40'>
      <TripMateTitle />
      <div className='w-full max-w-[420px] sm:max-w-[520px] bg-white/70 backdrop-blur-md rounded-[32px] shadow-[0_20px_70px_-10px_rgba(112,144,176,0.15)] relative border border-white mx-auto mt-32 sm:mt-40 p-1 sm:p-0'>
        {!register && (
          <button
            onClick={() => navigate(`/profile/${user}`)}
            className='absolute -top-3 -right-3 p-2.5 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] text-gray-400 hover:text-gray-600 z-50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-gray-50'
            aria-label='Skip to reels'
          >
            <X className='w-5 h-5' />
          </button>
        )}

        <div className='p-4 sm:p-8 space-y-6 sm:space-y-8'>
          <div className='text-center space-y-2.5'>
            <div className='flex items-center justify-center gap-3'>
              <h1 className='text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                Photo Gallery
              </h1>
              <Image className='w-6 h-6 text-gray-700' />
            </div>
            <p className='text-xs sm:text-sm text-gray-500/90'>
              Share your favorite moments from your trips
            </p>
          </div>

          <div className='flex justify-center'>
            <div className='bg-gray-100/50 backdrop-blur-sm rounded-2xl p-1.5 inline-flex gap-2 w-full max-w-[280px] shadow-inner'>
              <button
                className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2.5 text-sm font-medium transition-all duration-300 ${
                  mediaType === 'photos'
                    ? 'bg-white text-[#4a90e2] shadow-sm border border-[#4a90e2]/20'
                    : 'bg-white/80 text-[#4a90e2]/70 hover:bg-white hover:text-[#4a90e2]'
                }`}
                onClick={() => {
                  setMediaType('photos');
                  setSelectedFiles([]);
                  setPreviewURLs([]);
                  setSelectedTrip(null);
                  refetchUserMedia();
                }}
              >
                <Image size={18} />
                Photos
              </button>
              {!register && (
              <button
                className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2.5 text-sm font-medium transition-all duration-300 ${
                  mediaType === 'reels'
                    ? 'bg-white text-[#4a90e2] shadow-sm border border-[#4a90e2]/20'
                    : 'bg-white/80 text-[#4a90e2]/70 hover:bg-white hover:text-[#4a90e2]'
                }`}
                onClick={() => {
                  setMediaType('reels');
                  setSelectedFiles([]);
                  setPreviewURLs([]);
                  setSelectedTrip(null);
                  refetchUserMedia();
                }}
              >
                <Film size={18} />
                  Reels
                </button>
              )}
            </div>
          </div>

          <div className='space-y-5 sm:space-y-7'>
            <label
              htmlFor='media-upload'
              className='group flex flex-col items-center justify-center w-full aspect-[3/2] border-[2.5px] border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-gray-50/30 transition-all duration-300 hover:border-blue-200 bg-white/30 backdrop-blur-sm min-h-[120px] sm:min-h-[180px]'
            >
              <input
                id='media-upload'
                type='file'
                accept={mediaType === 'photos' ? 'image/*' : 'video/*,image/*'}
                multiple
                onChange={handleFileChange}
                className='hidden'
              />
              <div className='text-center transform group-hover:scale-105 transition-transform duration-300'>
                <div className='w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center shadow-sm group-hover:shadow group-hover:bg-white transition-all duration-300'>
                  <Upload
                    size={26}
                    className='text-gray-400 group-hover:text-blue-500 transition-colors duration-300'
                  />
                </div>
                <span className='block text-sm font-medium text-gray-700'>
                  Drop your {mediaType} here
                </span>
                <span className='block text-xs text-gray-400 mt-1.5'>
                  or click to browse files
                </span>
              </div>
            </label>

            {existingMedia.length > 0 && (
              <div className='space-y-3 sm:space-y-4'>
                <h2 className='text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2.5'>
                  <Users size={16} className='text-gray-500' />
                  Existing {mediaType === 'photos' ? 'Photos' : 'Reels'}
                </h2>
                <div className='grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4'>
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
              <div className='space-y-3 sm:space-y-4'>
                <h2 className='text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2.5'>
                  <Upload size={16} className='text-gray-500' />
                  New {mediaType === 'photos' ? 'Photos' : 'Reels'}
                </h2>
                <div className='grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4'>
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
              <div className='space-y-2 sm:space-y-3'>
                <label className='block text-xs sm:text-sm font-medium text-gray-700'>
                  Select Trip
                </label>
                <select
                  value={selectedTrip || ''}
                  onChange={(e) => handleTripChange(e.target.value)}
                  className='w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-white/80 backdrop-blur-sm transition-all duration-300 shadow-sm'
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

            <div className='flex justify-center pt-2 sm:pt-4 mb-16'>
              <button
                onClick={() => uploadMutation.mutate()}
                disabled={
                  selectedFiles.length === 0 ||
                  uploadMutation.isLoading ||
                  (mediaType === 'reels' && !selectedTrip)
                }
                className='w-full max-w-[240px] px-4 sm:px-6 py-2.5 sm:py-3.5 bg-white text-blue-500 border border-gray-100 text-xs sm:text-sm font-medium rounded-2xl hover:bg-blue-50/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-sm hover:shadow group'
              >
                {uploadMutation.isLoading ? (
                  <>
                    <Spinner size={20} color='text-blue-500' />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload
                      size={20}
                      className='text-blue-500 group-hover:scale-110 transition-transform duration-300'
                    />
                    <span>Upload {mediaType}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {uploadMutation.isLoading && (
        <div className='fixed inset-0 bg-white/10 backdrop-blur-sm z-50 flex flex-col items-center justify-center'>
          <div className='bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_70px_-10px_rgba(112,144,176,0.2)] flex flex-col items-center max-w-sm mx-4 border border-white'>
            <div className='bg-blue-50/50 p-4 rounded-2xl'>
              <Spinner size={52} color='text-blue-500' />
            </div>
            <p className='mt-5 text-gray-800 font-medium text-base'>
              Uploading your {mediaType}...
            </p>
            <p className='text-sm text-gray-500 mt-2'>
              Please wait while we process your files
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMediaPage;
