import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { fetchLanguageOptions } from '@/utils/profileSetupUtils';
import { Country, City } from 'country-state-city';
import { useEffect, useState } from 'react';

const useProfileDataQueries = (selectedCountry) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(
      Country.getAllCountries().map((c) => ({
        name: c.name,
        code: c.isoCode,
      })),
    );
    if (selectedCountry) {
      setCities(
        City.getCitiesOfCountry(selectedCountry.code).map((c) => c.name),
      );
    }
  }, [selectedCountry]);


  const { data: languageOptions = [], isLoading: loadingLanguages } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const languages = await fetchLanguageOptions();
      return [...languages].sort().map((l) => ({ value: l, label: l }));
    },
    onError: () => toast.error('Failed to load languages'),
  });

  return {
    countries,
    cities,
    languageOptions,
    loadingLanguages,
  };
};

export default useProfileDataQueries;
