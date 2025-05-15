import { toast } from "sonner";

const FormValidator = (form, setErrors) => {
  const validateForm = () => {
    const newErrors = {};
    
    try {
      if (!form.country) {
        newErrors.country = "Country is required";
      }
      
      if (!form.location) {
        newErrors.location = "City is required";
      }
      
      if (form.languages.length === 0) {
        newErrors.languages = "At least one language is required";
      }
      
      if (form.lookingFor.length === 0) {
        newErrors.lookingFor = "Please select what you're looking for";
      }
      
      if (form.mates < 0) {
        newErrors.mates = "Number of mates cannot be negative";
      }
      
      if (form.bio && form.bio.length > 500) {
        newErrors.bio = "Bio cannot exceed 500 characters";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("An error occurred during validation");
      return false;
    }
  };

  return validateForm;
};

export default FormValidator; 