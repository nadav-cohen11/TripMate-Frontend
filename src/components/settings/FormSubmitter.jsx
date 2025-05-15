import { toast } from "sonner";
import { updateUser } from "../../api/userApi";

const FormSubmitter = (form, imgURL, isSubmitting, setIsSubmitting, navigate, validateForm) => {
  const onSubmit = async(e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      if (!validateForm()) {
        toast.error("Please fix the errors in the form");
        return;
      }

      const userData = {
        ...form,
        languages: form.languages.map(lang => lang.value),
        lookingFor: form.lookingFor.map(item => item.value),
        profilePicture: imgURL
      };

      const response = await updateUser(userData);
      toast.success("Settings saved successfully!");
      
    } catch (error) {
      console.error("Form submission error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Please log in again to continue");
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to update these settings");
      } else if (error.response?.status === 404) {
        toast.error("User not found. Please try logging in again.");
        navigate('/login');
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (!error.response) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(error.response?.data?.message || "Failed to save settings. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return onSubmit;
};

export default FormSubmitter; 