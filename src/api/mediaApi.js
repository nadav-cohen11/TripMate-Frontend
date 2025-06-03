import api from './axios'

export const uploadFiles = async (endpoint, files, isMultiple = false) => {
  console.log("files: ", files);
  
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

  const res = await api.post(`/media/${endpoint}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.photos;
};
