import api from "./axios";

export const getWeather = async (city, country) => {
    return api.post('/ai/current-weather', {
      city,
      country,
    });
  };