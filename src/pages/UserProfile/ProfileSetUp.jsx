import { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { register, updateUser } from '@/api/userApi';
import { extractBackendError } from '@/utils/errorUtils';
import { uploadFiles } from '@/api/mediaApi';
import { adventureStyles, genders } from '../../constants/profile';
import useProfileSetupForm from '@/hooks/useProfileSetupForm';
import useProfileDataQueries from '@/hooks/useProfileDataQueries';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

export default function ProfileSetup({ nextStep, formRegister }) {
  const {
    form,
    imgURLs,

    setImgURLs,
    handleSocialChange,
    handleInputChange,
    handleLocationChange,
    handleLanguagesChange,
    handleAdventureStyleChange,
  } = useProfileSetupForm(formRegister);

  const [selectedPhotos, setSelectedPhotos] = useState(null);
  const [previewURLs, setPreviewURLs] = useState([]);

  useEffect(() => {
    if (!selectedPhotos) {
      setPreviewURLs([]);
      return;
    }
    const urls = Array.from(selectedPhotos).map((file) =>
      URL.createObjectURL(file),
    );
    setPreviewURLs(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedPhotos]);
  
  const { countries, cities, langs } =
    useProfileDataQueries(form.location?.country);

  const mutationRegister = useMutation({
    mutationFn: register,
    onSuccess: async () => {
      toast.success('User registered successfully');
      if (selectedPhotos && selectedPhotos.length > 0) {
        try {
          const uploaded = await uploadFiles(
            'upload-profile',
            selectedPhotos,
            false,
          );
          setImgURLs(uploaded);
          nextStep;
        } catch (uploadErr) {
          toast.error('Photo upload failed');
          console.error(uploadErr);
        }
      }
      nextStep();
    },
    onError: (err) => {
      const message = extractBackendError(err);
      toast.error(message);
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: async (data) => updateUser(data, { method: 'PUT' }),
    onSuccess: async () => {
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      const msg = extractBackendError(error);
      toast.error(msg);
      console.log(error);
    },
  });


  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      location: {
        ...form.location,
        country: form.location?.country?.name || '',
      },
      socialLinks: {
        instagram: form.socialLinks?.instagram
          ? `https://instagram.com/${form.socialLinks.instagram}`
          : '',
        facebook: form.socialLinks?.facebook
          ? `https://facebook.com/${form.socialLinks.facebook}`
          : '',
      },
      languagesSpoken: form.languagesSpoken.map((o) => o.value),
    };

    if (!formRegister) mutationUpdate.mutate(payload);
    else mutationRegister.mutate(payload);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf4ff] to-[#dbeeff] px-4 py-8 overflow-auto'>
      <form
        onSubmit={onSubmit}
        className='bg-white rounded-3xl shadow-xl p-4 sm:p-6 w-full max-w-md flex flex-col gap-4 text-[#2D4A53] transition-all duration-300 max-h-[90vh] overflow-y-auto'
        style={{ minHeight: 'unset' }}
      >
        <div className='flex flex-col items-center gap-2'>
          <div className='flex gap-2'>
            {previewURLs.length > 0 ? (
              previewURLs.map((url, idx) => (
                <div
                  key={idx}
                  className='h-16 w-16 rounded-full bg-gray-200 overflow-hidden shadow-md border border-gray-300'
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
                  className='h-16 w-16 rounded-full bg-gray-200 overflow-hidden shadow-md border border-gray-300'
                >
                  <img
                    src={url}
                    alt='avatar'
                    className='h-full w-full object-cover'
                  />
                </div>
              ))
            ) : (
              <div className='h-20 w-20 rounded-full bg-gray-200 overflow-hidden shadow-md border border-gray-300' />
            )}
          </div>
          <label className='text-xs text-blue-600 underline cursor-pointer'>
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
          className='input-white bg-white border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-200 text-sm'
        />

        <input
          type='date'
          name='birthDate'
          value={form.birthDate}
          disabled={!formRegister}
          onChange={handleInputChange}
          required
          className='input-white bg-white border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-200 text-sm'
        />

        <select
          name='gender'
          value={form.gender}
          disabled={!formRegister}
          onChange={handleInputChange}
          required
          className='input-white bg-white border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-200 text-sm'
        >
          <option value=''>Gender</option>
          {genders.map((g) => (
            <option value={g.toLowerCase()} key={g}>
              {g}
            </option>
          ))}
        </select>

        <Select
          placeholder='Country'
          options={countries.map((c) => ({
            label: c.name,
            value: c,
          }))}
          value={
            form.location?.country
              ? {
                  label: form.location.country.name,
                  value: form.location.country,
                }
              : null
          }
          onChange={(o) => {
            handleLocationChange({ country: o?.value || '', city: '' });
          }}
          isSearchable
          classNamePrefix='rs'
          className='rounded-xl text-sm'
        />

        <Select
          placeholder='City'
          options={cities.map((c) => ({
            label: c,
            value: c,
          }))}
          value={
            form.location?.city
              ? { label: form.location.city, value: form.location.city }
              : null
          }
          onChange={(o) => handleLocationChange({ city: o ? o.value : '' })}
          isSearchable
          isDisabled={!form.location?.country}
          classNamePrefix='rs'
          className='rounded-xl text-sm'
        />

        <Select
          placeholder='Select languages…'
          options={langs.map((l) => ({
            label: l,
            value: l,
          }))}
          isMulti
          value={form.languagesSpoken}
          onChange={handleLanguagesChange}
          isSearchable
          classNamePrefix='rs'
          className='rounded-xl text-sm'
        />

        <Select
          options={adventureStyles}
          placeholder='Adventure Style'
          value={
            adventureStyles.find((o) => o.value === form.adventureStyle) || null
          }
          onChange={handleAdventureStyleChange}
          classNamePrefix='rs'
          className='rounded-xl text-sm'
        />

        <textarea
          name='bio'
          rows={2}
          placeholder='Bio (optional)'
          value={form.bio}
          onChange={handleInputChange}
          className='input-white bg-white border border-gray-300 rounded-xl px-3 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
        />

        <div className='flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-1.5 bg-white focus-within:ring-2 focus-within:ring-pink-300 text-sm'>
          <FaInstagram className='text-pink-500 text-base' />
          <span className='text-gray-500 text-xs'>instagram.com/</span>
          <input
            type='text'
            name='instagram'
            value={form.socialLinks?.instagram}
            onChange={handleSocialChange}
            placeholder='your_username'
            className='flex-1 bg-transparent outline-none text-xs'
          />
        </div>

        <div className='flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-1.5 bg-white focus-within:ring-2 focus-within:ring-blue-300 text-sm'>
          <FaFacebook className='text-blue-600 text-base' />
          <span className='text-gray-500 text-xs'>facebook.com/</span>
          <input
            type='text'
            name='facebook'
            value={form.socialLinks?.facebook}
            onChange={handleSocialChange}
            placeholder='your.username'
            className='flex-1 bg-transparent outline-none text-xs'
          />
        </div>

        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2 font-medium transition text-sm'
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}
