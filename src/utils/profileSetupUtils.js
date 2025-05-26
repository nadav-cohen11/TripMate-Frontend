import axios from 'axios';

export const fetchCountryOptions = async () => {
  try {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/positions');
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const fetchLanguageOptions = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const arr = response.data;
    const set = new Set();
    arr.forEach(
      (c) =>
        c.languages &&
        Object.values(c.languages).forEach((l) => set.add(l)),
    );
    return Array.from(set);
  } catch (err) {
    throw err;
  }
};

export const fetchCities = async (country) => {
  try {
    const res = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/cities',
      { country },
    );
    const { data = [] } = res.data;
    return data;
  } catch (err) {
    throw err;
  }
};