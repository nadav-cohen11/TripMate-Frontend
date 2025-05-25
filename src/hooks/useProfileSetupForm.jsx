import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/userApi';
import { getCurrentLocation } from '@/utils/getLocationUtiles';

export function useProfileSetupForm(formRegister) {
  const [form, setForm] = useState({
    email: formRegister?.email || '',
    password: formRegister?.password || '',
    fullName: '',
    birthDate: '',
    gender: '',
    location: {
      country: '',
      city: '',
    },
    languagesSpoken: [],
    adventureStyle: '',
    bio: '',
  });

  const [imgURLs, setImgURLs] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      const location = await getCurrentLocation();
      setForm((prevForm) => ({
        ...prevForm,
        location: {
          ...prevForm.location,
          ...location,
        },
      }));
    };
    getLocations();
  }, []);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 5 * 60 * 1000,
    enabled: !formRegister,
  });

  useEffect(() => {
    if (user && !formRegister) {
      setForm({
        fullName: user.fullName || '',
        birthDate: user.birthDate ? user.birthDate.slice(0, 10) : '',
        gender: user.gender || '',
        location: {
          country: user.location?.country || '',
          city: user.location?.city || '',
        },
        languagesSpoken: (user.languagesSpoken || []).map((l) => ({
          value: l,
          label: l,
        })),
        adventureStyle: user.adventureStyle || '',
        bio: user.bio || '',
      });
      if (user.photos) setImgURLs(user.photos);
    }
  }, [user, formRegister]);

  const handleInputChange = (e) => {
    if (e.target.name === 'country' || e.target.name === 'city') {
      setForm((f) => ({
        ...f,
        location: {
          ...f.location,
          [e.target.name]: e.target.value,
        },
      }));
    } else {
      setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }
  };

  const handleLocationChange = (newLocation) => {
    setForm((prevForm) => ({
      ...prevForm,
      location: {
        ...prevForm.location,
        ...newLocation,
      },
    }));
  };

  const handleLanguagesChange = (selectedLanguages) => {
    setForm((f) => ({ ...f, languagesSpoken: selectedLanguages || [] }));
  };

  const handleAdventureStyleChange = (selectedStyle) => {
    setForm((f) => ({ ...f, adventureStyle: selectedStyle?.value || '' }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setImgURLs(urls);
  };

  return {
    form,
    imgURLs,

    setForm,
    setImgURLs,
    handleInputChange,
    handleLocationChange,
    handleLanguagesChange,
    handleAdventureStyleChange,
    handleImageUpload,
  };
}
