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


export const getPendingMatches = async () => {
  try {
    const response = await api.get('/matches/pending/received');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConfirmedMatches = async () => {
  try {
    const response = await api.get('/matches/confirmed');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const accept = async (matchId) => {
  try {
    const response = await api.post('/matches/accept', {
      matchId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const decline = async (matchId) => {
  try {
    const response = await api.post('/matches/decline', {
      matchId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const block = async (matchId) => {
  try {
    const response = await api.post('/matches/block', {
      matchId,
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
  return response.data;
};