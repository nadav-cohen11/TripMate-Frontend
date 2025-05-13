export const extractBackendError = (err) => {
    if (err?.response?.data?.error?.message) {
      return err.response.data.error.message;
    }
    if (err?.message) {
      return err.message;
    }
    return 'An unknown error occurred';
  };