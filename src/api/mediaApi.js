import api from './axios';

export const uploadFiles = async (endpoint, files, isMultiple = false, tripId = null, firstComment = null) => {
  if (!files || files.length === 0) throw new Error('No files selected');

  const formData = new FormData();

  const fileArray = Array.from(files);

  if (isMultiple) {
    for (let i = 0; i < fileArray.length; i++) {
      formData.append('photos', fileArray[i]);
    }
    console.log("FormData with multiple files:", formData);
  } else {
    const fieldName = endpoint === 'upload-profile' ? 'profile' : 'reel';
    formData.append(fieldName, fileArray[0]);
  }

  if (tripId) {
    formData.append('tripId', tripId);
  }

  if (firstComment) {
    formData.append('firstComment', firstComment);
  }

  const res = await api.post(`/media/${endpoint}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.photos;
};

export const deleteFile = async (publicId, mediaType = 'photos') => {
  try {
    const endpoint = mediaType === 'photos' ? 'delete-photo' : 'delete-reel';
    const res = await api.delete(`/media/${endpoint}`, {
      data: { publicId },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
