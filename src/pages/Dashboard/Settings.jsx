import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Select      from "react-select";
import { toast }   from "sonner";
import { updateUser } from "../../api/userApi";
import { whiteSelect } from '../../styles/selectStyles'; 

const lookingOptions = [
  "Hiking", "Trekking", "Cycling", "Mountain Biking",
  "Climbing", "Camping", "Fishing", "Rafting", "Surfing",
  "Snorkeling", "Skiing", "Snowboarding", "Horseback Riding",
  "Photography", "Yoga Retreat", "Beach Relaxation", "Volunteering",
].map(v => ({ value: v, label: v }));

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#2D4A53]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-gray-500 hover:text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="text-[#2D4A53]">{children}</div>
      </div>
    </div>
  );
};

export default function Settings() {
  const navigate = useNavigate();
  const [countryOptions, setCountryOptions]  = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [imgURL, setImgURL] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    country: "", location: "",
    languages: [], lookingFor: [], mates: 0, bio: "",
    notifications: { messages: true, newFriends: true },
  });

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

  const onInput = e => {
    try {
      setForm(f => ({ ...f, [e.target.name]: e.target.value }));
      // Clear error when user starts typing
      if (errors[e.target.name]) {
        setErrors(prev => ({ ...prev, [e.target.name]: null }));
      }
    } catch (error) {
      console.error("Input error:", error);
      toast.error("An error occurred while updating input");
    }
  };

  const toggleNotif = k => {
    try {
      setForm(f => ({
        ...f,
        notifications: { ...f.notifications, [k]: !f.notifications[k] },
      }));
    } catch (error) {
      console.error("Notification toggle error:", error);
      toast.error("An error occurred while updating notifications");
    }
  };

  const onFile = e => {
    try {
      const f = e.target.files[0];
      if (f) {
        if (f.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error("File size should be less than 5MB");
          return;
        }
        if (!f.type.startsWith('image/')) {
          toast.error("Please upload an image file");
          return;
        }
        setImgURL(URL.createObjectURL(f));
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("An error occurred while uploading the file");
    }
  };

  const onSubmit = async(e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission

    try {
      setIsSubmitting(true);
      
      if (!validateForm()) {
        toast.error("Please fix the errors in the form");
        return;
      }

      // Prepare the data for submission
      const userData = {
        ...form,
        languages: form.languages.map(lang => lang.value),
        lookingFor: form.lookingFor.map(item => item.value),
        profilePicture: imgURL
      };

      console.log('Submitting user data:', userData); // Debug log

      const response = await updateUser(userData);
      console.log('Update response:', response); // Debug log
      
      toast.success("Settings saved successfully!");
      
    } catch (error) {
      console.error("Form submission error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Handle specific error cases
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

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then(r => r.json())
      .then(({ data }) =>
        setCountryOptions(
          data.map(c => ({ value: c.name, label: c.name }))
              .sort((a, b) => a.label.localeCompare(b.label))
        )
      )
      .catch(err => { console.error(err); toast.error("Failed to load countries"); });
  }, []);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then(r => r.json())
      .then(arr => {
        const set = new Set();
        arr.forEach(c => c.languages &&
          Object.values(c.languages).forEach(l => set.add(l))
        );
        setLanguageOptions(
          [...set].sort().map(l => ({ value: l, label: l }))
        );
      })
      .catch(err => { console.error(err); toast.error("Failed to load languages"); });
  }, []);

  const loadCities = async country => {
    if (!country) return setCityOptions([]);
    setLoadingCities(true);
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch cities");
      }
      const { data = [] } = await res.json();
      setCityOptions(
        data.sort((a, b) => a.localeCompare(b))
            .map(n => ({ value: n, label: n }))
      );
    } catch (err) {
      console.error(err);
      setCityOptions([]);
      toast.error("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  const whiteBox = "bg-white border border-gray-300 rounded-lg shadow-sm";

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/assets/images/newBackground.jpg')" }}
    >
      <form
        onSubmit={onSubmit}
        className="bg-white/10 backdrop-blur-md text-[#2D4A53] p-8 w-full max-w-lg rounded-3xl shadow-xl flex flex-col gap-8"
      >
        <section className="flex flex-col items-center gap-4">
          <div className={`h-28 w-28 rounded-full bg-gray-300 overflow-hidden ${whiteBox}`}>
            {imgURL && (
              <img
                src={imgURL}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <label className="text-sm text-indigo-600 underline cursor-pointer">
            Upload profile picture
            <input type="file" accept="image/*" onChange={onFile} className="sr-only" />
          </label>
        </section>

        <section className="flex flex-col gap-4">
          <Select
            placeholder="Country"
            options={countryOptions}
            value={countryOptions.find(o => o.value === form.country) || null}
            onChange={o => {
              try {
                setForm(f => ({ ...f, country: o?.value || "", location: "" }));
                loadCities(o?.value);
                if (errors.country) {
                  setErrors(prev => ({ ...prev, country: null }));
                }
              } catch (error) {
                console.error("Country selection error:", error);
                toast.error("An error occurred while selecting country");
              }
            }}
            isSearchable
            styles={whiteSelect}
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

          <Select
            placeholder={loadingCities ? "Loading cities…" : "City"}
            options={cityOptions}
            value={cityOptions.find(o => o.value === form.location) || null}
            onChange={o => {
              try {
                setForm(f => ({ ...f, location: o?.value || "" }));
                if (errors.location) {
                  setErrors(prev => ({ ...prev, location: null }));
                }
              } catch (error) {
                console.error("City selection error:", error);
                toast.error("An error occurred while selecting city");
              }
            }}
            isSearchable
            isDisabled={!form.country || loadingCities}
            styles={whiteSelect}
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </section>

        <section className="flex flex-col gap-4">
          <Select
            placeholder="Select languages…"
            options={languageOptions}
            isMulti
            value={form.languages}
            onChange={sel => {
              try {
                setForm(f => ({ ...f, languages: sel || [] }));
                if (errors.languages) {
                  setErrors(prev => ({ ...prev, languages: null }));
                }
              } catch (error) {
                console.error("Language selection error:", error);
                toast.error("An error occurred while selecting languages");
              }
            }}
            isSearchable
            styles={whiteSelect}
          />
          {errors.languages && <p className="text-red-500 text-sm">{errors.languages}</p>}

          <Select
            options={lookingOptions}
            isMulti
            placeholder="Looking for?"
            value={form.lookingFor}
            onChange={sel => {
              try {
                setForm(f => ({ ...f, lookingFor: sel }));
                if (errors.lookingFor) {
                  setErrors(prev => ({ ...prev, lookingFor: null }));
                }
              } catch (error) {
                console.error("Looking for selection error:", error);
                toast.error("An error occurred while selecting preferences");
              }
            }}
            styles={whiteSelect}
          />
          {errors.lookingFor && <p className="text-red-500 text-sm">{errors.lookingFor}</p>}

          <textarea
            name="bio"
            rows={2}
            placeholder="Bio (optional)"
            value={form.bio}
            onChange={onInput}
            className={`w-full px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${whiteBox} resize-none`}
          />
          {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
        </section>

        <section className="flex flex-col gap-1 text-sm pt-2 border-t border-gray-300/30">
          <button
            type="button"
            onClick={() => openModal('help')}
            className="text-indigo-600 hover:underline self-start text-left"
          >
            Help &amp; Support
          </button>
          <button
            type="button"
            onClick={() => openModal('privacy')}
            className="text-indigo-600 hover:underline self-start text-left"
          >
            Privacy Center
          </button>
          <button
            type="button"
            onClick={() => openModal('about')}
            className="text-indigo-600 hover:underline self-start text-left"
          >
            About TripMate
          </button>
        </section>

        <button 
          type="submit" 
          className={`btn-primary mt-4 rounded-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'SAVING...' : 'SAVE'}
        </button>
      </form>

      {/* Help & Support Modal */}
      <Modal
        isOpen={activeModal === 'help'}
        onClose={closeModal}
        title="Help & Support"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">How can we help you?</h3>
          <div className="space-y-2">
            <p>Need assistance? Here are some ways to get help:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Email us at support@tripmate.com</li>
              <li>Check our FAQ section for common questions</li>
              <li>Join our community forum</li>
              <li>Contact us through social media</li>
            </ul>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Common Issues</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Account settings and preferences</li>
              <li>Profile customization</li>
              <li>Matching and connections</li>
              <li>Safety and security</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Privacy Center Modal */}
      <Modal
        isOpen={activeModal === 'privacy'}
        onClose={closeModal}
        title="Privacy Center"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Privacy Matters</h3>
          <div className="space-y-2">
            <p>At TripMate, we take your privacy seriously. Here's how we protect your data:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your personal information is encrypted and secure</li>
              <li>You control who sees your profile and information</li>
              <li>We never share your data with third parties without consent</li>
              <li>You can delete your account and data at any time</li>
            </ul>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Privacy Settings</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Profile visibility controls</li>
              <li>Location sharing preferences</li>
              <li>Data usage and storage</li>
              <li>Communication preferences</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* About TripMate Modal */}
      <Modal
        isOpen={activeModal === 'about'}
        onClose={closeModal}
        title="About TripMate"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Connecting Solo Travelers Worldwide</h3>
          <div className="space-y-2">
            <p>
              TripMate is a platform designed to help solo travelers connect, share experiences,
              and create meaningful connections around the world. Our mission is to make solo
              travel more enjoyable and safer by connecting like-minded travelers.
            </p>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Our Features</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Smart matching with compatible travelers</li>
              <li>Safe and verified user profiles</li>
              <li>Travel planning and coordination tools</li>
              <li>Community-driven travel tips and recommendations</li>
            </ul>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Our Values</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Safety and security for all users</li>
              <li>Authentic travel experiences</li>
              <li>Community building and support</li>
              <li>Cultural exchange and understanding</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
