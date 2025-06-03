import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  fetchCities,
  fetchCountryOptions,
  fetchLanguageOptions,
} from '@/utils/profileSetupUtils';

const useProfileDataQueries = (selectedCountry) => {
  const { data: countryOptions = [], isLoading: loadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      let countries = await fetchCountryOptions();
      countries = countries.filter((_, ind) => ind !== 166);
      return countries
        .map((c) => ({ value: c.name, label: c.name }))
        .sort((a, b) => a.label.localeCompare(b.label));
    },
    onError: () => toast.error('Failed to load countries'),
  });

  const { data: languageOptions = [], isLoading: loadingLanguages } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const languages = await fetchLanguageOptions();
      return [...languages].sort().map((l) => ({ value: l, label: l }));
    },
    onError: () => toast.error('Failed to load languages'),
  });

  const { data: cityOptions = [], isLoading: loadingCities } = useQuery({
    queryKey: ['cities', selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const cities = await fetchCities(selectedCountry);
      return cities
        .sort((a, b) => a.localeCompare(b))
        .map((n) => ({ value: n, label: n }));
    },
    enabled: !!selectedCountry,
    onError: () => toast.error('Failed to load cities'),
  });

  return {
    countryOptions,
    loadingCountries,
    languageOptions,
    loadingLanguages,
    cityOptions,
    loadingCities,
  };
}


export default useProfileDataQueries;