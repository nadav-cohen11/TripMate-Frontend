import { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { register, updateUser } from '@/api/userApi';
import { extractBackendError } from '@/utils/errorUtils';
import { useNavigate } from 'react-router-dom';
import { uploadFiles } from '@/api/mediaApi';
import { adventureStyles, genders } from './constants';
import { useProfileSetupForm } from '@/hooks/useProfileSetupForm';
import { useProfileDataQueries } from '@/hooks/useProfileDataQueries';

export default function ProfileSetup({ nextStep, formRegister }) {
  const {
    form,
    imgURLs,
    setImgURLs,
    handleInputChange,
    handleLocationChange,
    handleLanguagesChange,
    handleAdventureStyleChange,
  } = useProfileSetupForm(formRegister);

  const [selectedPhotos, setSelectedPhotos] = useState(null)
  const [previewURLs, setPreviewURLs] = useState([]);

  useEffect(() => {
    if (!selectedPhotos) {
      setPreviewURLs([]);
      return;
    }
    const urls = Array.from(selectedPhotos).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewURLs(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedPhotos]);

  const {
    countryOptions,
    loadingCountries,
    languageOptions,
    loadingLanguages,
    cityOptions,
    loadingCities,
  } = useProfileDataQueries(form.location?.country);

  const mutationRegister = useMutation({
    mutationFn: register,
    onSuccess: async () => {
      toast.success('User registered successfully');
      nextStep()
    },
    onError: (err) => {
      const message = extractBackendError(err);
      toast.error(message);
    },
  });


  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      email: formRegister.email,
      password: formRegister.password,
      languagesSpoken: form.languagesSpoken.map((o) => o.value),
    };

    mutationRegister.mutate(payload, {
      onSuccess: async () => {
        toast.success('User registered successfully');
        if (selectedPhotos && selectedPhotos.length > 0) {
          try {
            const uploaded = await uploadFiles('upload-profile', selectedPhotos, false);
            setImgURLs(uploaded);
            nextStep
          } catch (uploadErr) {
            toast.error('Photo upload failed');
            console.error(uploadErr);
          }
        }
      },
      onError: (err) => {
        const msg = extractBackendError(err);
        toast.error(msg);
      },
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf4ff] to-[#dbeeff] px-4'>
      <form
        onSubmit={onSubmit}
        className='bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md flex flex-col gap-6 text-[#2D4A53] transition-all duration-300'
      >
        <div className='flex flex-col items-center gap-3'>
          <div className='flex gap-2'>
            {previewURLs.length > 0 ? (
              previewURLs.map((url, idx) => (
                <div
                  key={idx}
                  className='h-20 w-20 rounded-full bg-gray-200 overflow-hidden shadow-md border border-gray-300'
                >
                  <img
                    src={url}
                    alt='preview'
                    className='h-full w-full object-cover'
                  />
                </div>
              ))
            ) : imgURLs.length > 0 ? (
              imgURLs.map((url, idx) => (
                <div
                  key={idx}
                  className='h-20 w-20 rounded-full bg-gray-200 overflow-hidden shadow-md border border-gray-300'
                >
                  <img
                    src={url}
                    alt='avatar'
                    className='h-full w-full object-cover'
                  />
                </div>
              ))
            ) : (
              <div className='h-28 w-28 rounded-full bg-gray-200 overflow-hidden shadow-md border border-gray-300' />
            )}
          </div>
          <label className='text-sm text-blue-600 underline cursor-pointer'>
            Upload Profile Pictures
            <input
              type='file'
              multiple
              accept='image/*'
              onChange={(e) => setSelectedPhotos(e.target.files)}
              className='sr-only'
            />
          </label>
        </div>
        <input
          type='text'
          name='fullName'
          value={form.fullName}
          onChange={handleInputChange}
          disabled={!formRegister}
          placeholder='Full Name'
          required
          className='input-white bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bgx-gray-400'
        />

        <input
          type='date'
          name='birthDate'
          value={form.birthDate}
          disabled={!formRegister}
          onChange={handleInputChange}
          required
          className='input-white bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-200'
        />

        <input
          type='text'
          name='gender'
          value={form.gender}
          disabled={!formRegister}
          onChange={handleInputChange}
          placeholder='Gender'
          required
          className='input-white bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-200'
        />
        <Select
          placeholder={
            !form.location?.country
              ? 'Select country first'
              : loadingCities
                ? 'Loading cities…'
                : 'City'
          }
          options={cityOptions}
          value={
            form.location?.city
              ? cityOptions.find((o) => o.value === form.location?.city) || null
              : null
          }
          onChange={(o) => handleLocationChange({ city: o ? o.value : '' })}
          isSearchable
          isDisabled={!form.location?.country || loadingCities}
          classNamePrefix='rs'
          className='rounded-xl'
        />

        <input
          type='text'
          name='city'
          value={form.location?.city || ''}
          onChange={(e) => handleLocationChange({ city: e.target.value })}
          placeholder='City'
          required
          className='input-white bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
        />

        <input
          type='text'
          name='languagesSpoken'
          value={form.languagesSpoken.map((l) => l.label || l.value).join(', ')}
          onChange={(e) =>
            handleLanguagesChange(
              e.target.value
                .split(',')
                .map((lang) => ({ label: lang.trim(), value: lang.trim() }))
            )
          }
          placeholder='Languages Spoken (comma separated)'
          className='input-white bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
        />

        <input
          type='text'
          name='adventureStyle'
          value={form.adventureStyle}
          onChange={handleAdventureStyleChange}
          placeholder='Adventure Style'
          className='input-white bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
        />

        <textarea
          name='bio'
          rows={2}
          placeholder='Bio (optional)'
          value={form.bio}
          onChange={handleInputChange}
          className='input-white bg-white border border-gray-300 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300'
        />

        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2 font-medium transition'
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
export default ProfileSetup
}
