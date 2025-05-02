import { toast } from "react-toastify";

export const handleApiError = (error, fallbackMessage = "An unexpected error occurred") => {
  let errorMessage = fallbackMessage;
  let statusCode = null;

  if (error?.response) {
    statusCode = error.response.status;
    errorMessage = error.response.data?.error?.message || fallbackMessage;
    console.error(`Backend Error: ${statusCode || 'Unknown Status'} - ${errorMessage}`);
  } else if (error?.request) {
    errorMessage = "No response from server. Please check your network.";
  } else if (error?.message) {
    errorMessage = error.message;
  }

  toast.error(errorMessage);

  return {
    message: errorMessage,
    status: statusCode,
    originalError: error,
  };
};
