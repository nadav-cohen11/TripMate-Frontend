import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/userApi';
import { getCurrentLocation } from '@/utils/getLocationUtiles';
import { Country } from 'country-state-city';

const useProfileSetupForm = (formRegister) => {
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
    instagram: '',
    facebook: '',
    socialLinks: {
      instagram: '',
      facebook: '',
    },
  });

  const [imgURLs, setImgURLs] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      const loc = await getCurrentLocation();
      setForm((prevForm) => ({
        ...prevForm,
        location: {
          coordinates: loc,
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
          country: {
        name: user.location?.country || '',
        code:
          Country.getAllCountries().find(
            (c) => c.name === user.location?.country,
          )?.isoCode || '',
          },
          city: user.location?.city || '',
        },
        languagesSpoken: (user.languagesSpoken || []).map((l) => ({
          value: l,
          label: l,
        })),
        adventureStyle: user.adventureStyle || '',
        bio: user.bio || '',
        socialLinks: {
          instagram: user.socialLinks?.instagram
        ? user.socialLinks.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')
        : '',
          facebook: user.socialLinks?.facebook
        ? user.socialLinks.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '').replace(/\/$/, '')
        : '',
        },
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

  const handleSocialChange = (e) => {
    const { name, value } = e.target;

    setForm((f) => ({
      ...f,
      socialLinks: {
        ...f.socialLinks,
        [name]: value,
      },
    }));
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
    handleSocialChange,
    handleInputChange,
    handleLocationChange,
    handleLanguagesChange,
    handleAdventureStyleChange,
    handleImageUpload,
  };
};

export default useProfileSetupForm;
