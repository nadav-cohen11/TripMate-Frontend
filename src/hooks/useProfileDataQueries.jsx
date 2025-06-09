import { Country, City } from 'country-state-city';
import { useEffect, useState } from 'react';
import ISO6391 from 'iso-639-1';

const useProfileDataQueries = (selectedCountry) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [langs,setLangs] = useState([])

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


  useEffect(() => {
    setLangs(ISO6391.getAllNames());
  },[])


  return {
    countries,
    cities,
    langs,
  };
};

export default useProfileDataQueries;
