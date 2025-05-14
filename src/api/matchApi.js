import api from "./axios";

export const createOrAcceptMatch = async ({ user2Id, scores }) => {
  try {
    const response = await api.post('/matches/', {
      user2Id,
      scores,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unmatchUsers = async ({ user2Id }) => {
  try {
    const response = await api.post('/matches/unmatch', {
      user2Id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const NonMatchedUsers = async () => {
    const response = await api.get('/matches/home/NonMatchedUsers');
    return response;
};