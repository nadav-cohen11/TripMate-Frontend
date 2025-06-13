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
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner'; 
import LoginButton from '@/components/ui/loginButton';


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

  const { countries, cities, langs } =
    useProfileDataQueries(form.location?.country);

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
    console.log(error);
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
    else mutationRegister.mutate(payload);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-[#e6f0ff] px-4">
      <form
        onSubmit={onSubmit}
        className="
            bg-white
            rounded-3xl
            shadow-xl
            p-6
            sm:p-8
            flex
            flex-col
            gap-4
            sm:gap-6
            text-[#4a90e2]
            transition-all
            duration-300
        "
      >
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4a90e2]">
            Setup Your Profile
          </h1>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <div className='flex gap-2'> {loading ? (
              <Spinner size={64} color="text-blue-500" />
            ) : previewURLs.length > 0 ? (
              <div
                className='h-16 w-16 rounded-full bg-gray-200 overflow-hidden shadow-md border border-blue-300'
              >
                <img
                  src={previewURLs[0]}
                  alt='preview'
                  className='h-full w-full object-cover'
                />
              </div>
            ) : imgURLs.length > 0 ? (
              <div
                className='h-16 w-16 rounded-full bg-gray-200 overflow-hidden shadow-md border border-blue-300'
              >
                <img
                  src={imgURLs[0]}
                  alt='avatar'
                  className='h-full w-full object-cover'
                />
              </div>
            ) : (
              <div className='h-20 w-20 rounded-full bg-gray-200 overflow-hidden shadow-md border border-blue-300' />
            )}
          </div>
          <label className='text-xs text-blue-400 underline cursor-pointer'>
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
          className="
                w-full
                bg-white
                border
                border-blue-100
                rounded-xl
                px-4
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-blue-200
                text-[#4a90e2]
                placeholder:text-blue-200
              "
        />

        <div className="flex flex-col gap-1">
          <input
            type='date'
            name='birthDate'
            value={form.birthDate}
            disabled={!formRegister}
            onChange={handleBirthDateChange}
            required
            className={`w-full bg-white border ${ageError ? 'border-red-500' : 'border-blue-100'} rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-[#4a90e2] placeholder:text-blue-200`}
          />
          {ageError && (
            <p className="text-red-500 text-sm mt-1 bg-red-50 p-2 rounded-lg border border-red-200">
              {ageError}
            </p>
          )}
        </div>

        <select
          name='gender'
          value={form.gender}
          disabled={!formRegister}
          onChange={handleInputChange}
          required
          className="
              w-full
              bg-white
              border
              border-blue-100
              rounded-xl
              px-4
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-blue-200
              text-[#4a90e2]
              placeholder:text-blue-200
            "
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
          className="
              w-full
              bg-white
              border
              border-blue-100
              rounded-xl
              px-4
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-blue-200
              text-[#4a90e2]
              placeholder:text-blue-200
            "
        />

        <div className="flex items-center gap-2 border border-blue-100 rounded-xl px-4 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-200 text-[#4a90e2]">
          <FaInstagram className='text-pink-500 text-base' />
          <span className='text-blue-200'>instagram.com/</span>
          <input
            type='text'
            name='instagram'
            value={form.socialLinks?.instagram}
            onChange={handleSocialChange}
            placeholder='your_username'
            className='flex-1 bg-transparent outline-none text-[#4a90e2] placeholder:text-blue-200'
          />
        </div>

        <div className="flex items-center gap-2 border border-blue-100 rounded-xl px-4 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-200 text-[#4a90e2]">
          <FaFacebook className='text-blue-600 text-base' />
          <span className='text-blue-200'>facebook.com/</span>
          <input
            type='text'
            name='facebook'
            value={form.socialLinks?.facebook}
            onChange={handleSocialChange}
            placeholder='your.username'
            className='flex-1 bg-transparent outline-none text-[#4a90e2] placeholder:text-blue-200'
          />
        </div>

        <LoginButton
          type="submit"
          className="
              w-full
              !bg-[#4a90e2]
              !hover:bg-[#4a90e2]
              text-white
              rounded-xl
              py-2
              font-medium
              transition
              shadow-lg
              shadow-blue-200/25
            "
        >
          SUBMIT
        </LoginButton>
      </form>
    </div>
  );
}
