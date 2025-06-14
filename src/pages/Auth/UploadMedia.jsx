import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { uploadFiles, deleteFile, uploadToInstagram } from '@/api/mediaApi';
import { toast } from 'react-toastify';
import { extractBackendError } from '@/utils/errorUtils';
import { Spinner } from '@/components/ui/spinner';
import {
  X,
  Image,
  Film,
  Upload,
  Trash2,
  Users,
  UploadIcon,
} from 'lucide-react';
import { getAllTripsForUser } from '@/api/userApi';
import { FaInstagram } from 'react-icons/fa';

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
    if (
      mediaType === 'photos' &&
      location.state?.photos &&
      JSON.stringify(existingMedia) !== JSON.stringify(location.state.photos)
    ) {
      setExistingMedia(location.state.photos);
    } else if (
      mediaType === 'reels' &&
      location.state?.reels &&
      JSON.stringify(existingMedia) !== JSON.stringify(location.state.reels)
    ) {
      setExistingMedia(location.state.reels);
    }
  }, [location.state, mediaType]);

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
    onSuccess: (_, mediaId) => {
      toast.success(
        `${mediaType === 'photos' ? 'Photo' : 'Reel'} deleted successfully!`,
      );
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewURLs((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    if (
      window.confirm(
        `Are you sure you want to remove this ${
          mediaType === 'photos' ? 'photo' : 'reel'
        }?`,
      )
    ) {
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
    if (
      window.confirm(
        `Are you sure you want to delete this ${
          mediaType === 'photos' ? 'photo' : 'reel'
        }?`,
      )
    ) {
      deleteMutation.mutate(mediaId);
    }
  };

  const instagramMutation = useMutation({
    mutationFn: (mediaUrl) => uploadToInstagram(mediaUrl),
    onSuccess: () => {
      toast.success("Photo uploaded successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const { isPending } = instagramMutation;


  useEffect(() => {
    console.log(isPending);
  }, [isPending]);

  const uploadImgToInstagram = (mediaUrl) => {
    const confirmation = window.confirm(
      'Are you sure you want to publish this media in our Instagram page?',
    );
    if (!confirmation) return;
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
          <div className='absolute top-2 left-2 right-2 flex justify-between items-center'>
            <button
              onClick={() => uploadImgToInstagram(url)}
              className='bg-black/60 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300 transform hover:scale-110'
              title='Upload'
              aria-label={`Remove ${
                mediaType === 'photos' ? 'photo' : 'reel'
              } ${index + 1}`}
            >
              <FaInstagram />
            </button>
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
          </div>
        )}
      </div>
    );
  };

  
  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 py-12 px-4 sm:px-6 lg:px-8'>
      {isPending ? (
        <Spinner />
      ) : (
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              {mediaType === 'photos'
                ? '📸 Photo Gallery'
                : '🎥 Reel Collection'}
            </h1>
            <p className='text-lg text-gray-600'>
              {mediaType === 'photos'
                ? 'Share your favorite moments from your trips'
                : 'Create and share your travel stories'}
            </p>
          </div>

          <section className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-8'>
            <div className='space-y-4'>
              <label
                htmlFor='media-upload'
                className='flex flex-col items-center justify-center w-full p-12 border-3 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-300 hover:border-blue-400 group'
              >
                <input
                  id='media-upload'
                  type='file'
                  accept={
                    mediaType === 'photos' ? 'image/*' : 'video/*,image/*'
                  }
                  multiple
                  onChange={handleFileChange}
                  className='hidden'
                />
                <div className='text-center'>
                  <Upload
                    size={48}
                    className='mx-auto text-gray-400 group-hover:text-blue-500 transition-colors duration-300'
                  />
                  <span className='block text-xl font-medium text-gray-700 mt-4 group-hover:text-blue-600 transition-colors duration-300'>
                    {mediaType === 'photos'
                      ? 'Drop your photos here'
                      : 'Drop your reels here'}
                  </span>
                  <span className='block text-sm text-gray-500 mt-2'>
                    or click to browse files
                  </span>
                </div>
              </label>
            </div>

            {existingMedia.length > 0 && (
              <div className='space-y-4'>
                <h2 className='text-2xl font-semibold text-gray-800 flex items-center gap-2'>
                  <Users size={24} />
                  Existing {mediaType === 'photos' ? 'Photos' : 'Reels'}
                </h2>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
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
              <div className='space-y-4'>
                <h2 className='text-2xl font-semibold text-gray-800 flex items-center gap-2'>
                  <Upload size={24} />
                  New {mediaType === 'photos' ? 'Photos' : 'Reels'}
                </h2>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
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

            {mediaType === 'reels' && (
              <div className='space-y-2'>
                {trips.length > 0 ? (
                  <>
                    <label
                      htmlFor='trip-select'
                      className='block text-lg font-medium text-gray-700'
                    >
                      Select Trip
                    </label>
                    <select
                      id='trip-select'
                      value={selectedTrip || ''}
                      onChange={(e) => handleTripChange(e.target.value)}
                      className='mt-1 block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl shadow-sm transition-all duration-300'
                    >
                      <option value='' disabled>
                        Choose a trip
                      </option>
                      {trips.map((trip) => (
                        <option key={trip.tripId} value={trip.tripId}>
                          {trip.tripName} - {trip.destination.city},{' '}
                          {trip.destination.country}{' '}
                          {trip.travelDates.start
                            ? `(${new Date(
                                trip.travelDates.start,
                              ).toLocaleDateString()} - ${new Date(
                                trip.travelDates.end,
                              ).toLocaleDateString()})`
                            : ''}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <svg
                          className='h-5 w-5 text-yellow-400'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div className='ml-3'>
                        <p className='text-sm text-yellow-700'>
                          You need to create a trip before uploading reels.
                          Reels must be associated with a specific trip to help
                          organize your travel memories.
                          <br />
                          <a
                            href='/chat'
                            className='font-medium underline text-yellow-700 hover:text-yellow-600 mt-1 inline-block'
                          >
                            Create a new trip →
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className='flex justify-end pt-4'>
              <button
                onClick={() => uploadMutation.mutate()}
                disabled={
                  selectedFiles.length === 0 ||
                  uploadMutation.isLoading ||
                  (mediaType === 'reels' && !selectedTrip)
                }
                className='px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              >
                {uploadMutation.isLoading ? (
                  <>
                    <Spinner size={20} color='text-white' />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>
                      Upload {mediaType === 'photos' ? 'Photos' : 'Reels'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}

      {uploadMutation.isLoading && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-all duration-300 animate-fade-in'>
          <div className='bg-white/95 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm mx-4 transform transition-all duration-300'>
            <Spinner
              size={64}
              color='text-blue-600'
              speed='animate-spin-slow'
            />
            <p className='mt-6 text-gray-800 font-medium text-lg text-center'>
              {mediaType === 'photos'
                ? 'Uploading your photos...'
                : 'Uploading your reels...'}
            </p>
            <p className='text-sm text-gray-500 mt-2 text-center'>
              Please wait while we process your files
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMediaPage;
