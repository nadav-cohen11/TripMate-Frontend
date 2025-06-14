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
import { useNavigate } from 'react-router-dom';
import DatePicker from '@/components/ui/DatePicker';
import { Spinner } from '@/components/ui/spinner';
import { useLocation } from 'react-router-dom';


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
  const [loading, setLoading] = useState(false);
  const [ageError, setAgeError] = useState('');
  const location = useLocation();
  const photo = location.state?.photo || null;


  const validateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 16) {
      setAgeError('We are sorry, but you must be at least 16 years old to register for TripMate.');
      return false;
    }
    setAgeError('');
    return true;
  };

  const handleBirthDateChange = (e) => {
    handleInputChange(e);
    validateAge(e.target.value);
  };

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

  const { countries, cities, langs } = useProfileDataQueries(
    form.location?.country,
  );

  const mutationRegister = useMutation({
    mutationFn: register,
    onSuccess: async () => {
      toast.success('User registered successfully');
      if (selectedPhotos && selectedPhotos.length > 0) {
        setLoading(true);
        try {
          const uploaded = await uploadFiles(
            'upload-profile',
            selectedPhotos,
            false,
          );
          setImgURLs(uploaded);
          setLoading(false);
          nextStep;
        } catch (uploadErr) {
          setLoading(false);
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

  const navigate = useNavigate()
  const mutationUpdate = useMutation({
    mutationFn: async (data) => updateUser(data, { method: 'PUT' }),
    onSuccess: async (updatedData) => {
      toast.success('Profile updated successfully');
      if (updatedData?.profilePhotoURL) {
        setImgURLs([updatedData.profilePhotoURL]);
      }
      navigate(`/profile/${updatedData._id}`);
    },
    onError: (error) => {
      const msg = extractBackendError(error);
      toast.error(msg);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateAge(form.birthDate)) {
      return;
    }
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
    else {
      if (
        !form.fullName ||
        !form.gender ||
        !form.birthDate ||
        !form.location?.country ||
        !form.location?.city ||
        !form.languagesSpoken ||
        form.languagesSpoken.length === 0 ||
        !form.adventureStyle
      ) {
        toast.error('Please fill in all required fields.');
        return;
      }
      mutationRegister.mutate(payload);
    }
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

            {loading ? (
              <Spinner size={64} color="text-blue-500" />
            ) : previewURLs.length > 0 ? (
              <div className='h-16 w-16 rounded-full bg-gray-200 overflow-hidden shadow-md border border-gray-300'>
                <img
                  src={previewURLs[0]}
                  alt='preview'
                  className='h-full w-full object-cover'
                />
              </div>
            ) : photo ? (
              <div
                className='h-16 w-16 rounded-full bg-gray-200 overflow-hidden shadow-md border border-gray-300'
              >
                <img
                  src={photo}
                  alt='user profile'
                  className='h-full w-full object-cover'
                />
              </div>
            ) : imgURLs.length > 0 ? (
              <div className='h-16 w-16 rounded-full bg-gray-200 overflow-hidden shadow-md border border-gray-300'>
                <img
                  src={photo}
                  alt='avatar'
                  className='h-full w-full object-cover'
                />
              </div>
            ) : (
              <div className='h-20 w-20 rounded-full bg-gray-200 overflow-hidden shadow-md border border-gray-300' />
            )}
          </div>

          <label className='text-xs text-blue-600 underline cursor-pointer'>
            Upload Profile Picture
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

        <DatePicker
          date={form.birthDate}
          handleInputChange={handleInputChange}
          name={'birthDate'}
          disabled={!formRegister}
        />

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
