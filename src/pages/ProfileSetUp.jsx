import { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/api/userApi';
import { extractBackendError } from '@/utils/errorUtils';
import { uploadFiles } from '@/api/mediaApi';
import { adventureStyles, genders } from './constants';
import useProfileSetupForm from '@/hooks/useProfileSetupForm';
import { useProfileDataQueries } from '@/hooks/useProfileDataQueries';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

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
      instagram: form.instagram ? `https://instagram.com/${form.instagram}` : '',
      facebook: form.facebook ? `https://facebook.com/${form.facebook}` : '',
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

        <select
          name='gender'
          value={form.gender}
          disabled={!formRegister}
          onChange={handleInputChange}
          required
          className='input-white bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-200'
        >
          <option value=''>Gender</option>
          {genders.map((g) => (
            <option value={g.toLowerCase()} key={g}>
              {g}
            </option>
          ))}
        </select>

        <Select
          placeholder={loadingCountries ? 'Loading countries…' : 'Country'}
          options={countryOptions}
          value={
            countryOptions.find((o) => o.value === form.location?.country) ||
            null
          }
          onChange={(o) => {
            handleLocationChange({ country: o?.value || '', city: '' });
          }}
          isSearchable
          classNamePrefix='rs'
          className='rounded-xl'
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

        <Select
          placeholder={
            loadingLanguages ? 'Loading languages…' : 'Select languages…'
          }
          options={languageOptions}
          isMulti
          value={form.languagesSpoken}
          onChange={handleLanguagesChange}
          isSearchable
          classNamePrefix='rs'
          className='rounded-xl'
        />

        <Select
          options={adventureStyles}
          placeholder='Adventure Style'
          value={
            adventureStyles.find((o) => o.value === form.adventureStyle) || null
          }
          onChange={handleAdventureStyleChange}
          classNamePrefix='rs'
          className='rounded-xl'
        />

        <textarea
          name='bio'
          rows={2}
          placeholder='Bio (optional)'
          value={form.bio}
          onChange={handleInputChange}
          className='input-white bg-white border border-gray-300 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300'
        />

        <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-300">
          <FaInstagram className="text-pink-500 text-lg" />
          <span className="text-gray-500 text-sm">instagram.com/</span>
          <input
            type="text"
            name="instagram"
            value={form.instagram}
            onChange={handleInputChange}
            placeholder="your_username"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-300">
          <FaFacebook className="text-blue-600 text-lg" />
          <span className="text-gray-500 text-sm">facebook.com/</span>
          <input
            type="text"
            name="facebook"
            value={form.facebook}
            onChange={handleInputChange}
            placeholder="your.username"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2 font-medium transition'
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}
