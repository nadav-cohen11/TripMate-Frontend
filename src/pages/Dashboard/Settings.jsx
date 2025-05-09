import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Select      from "react-select";
import { toast }   from "sonner";

const lookingOptions = [
  "Hiking", "Trekking", "Cycling", "Mountain Biking",
  "Climbing", "Camping", "Fishing", "Rafting", "Surfing",
  "Snorkeling", "Skiing", "Snowboarding", "Horseback Riding",
  "Photography", "Yoga Retreat", "Beach Relaxation", "Volunteering",
].map(v => ({ value: v, label: v }));

const whiteSelect = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(99,102,241,.5)" : undefined,
    "&:hover": { borderColor: "#6366f1" },
    minHeight: "2.5rem",
  }),
  placeholder: base => ({ ...base, color: "#6b7280" }),
  singleValue: base => ({ ...base, color: "#1f2937" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#eef2ff" : "#ffffff",
    color: "#1f2937",
    "&:active": { backgroundColor: "#e0e7ff" },
  }),
  multiValue: base => ({ ...base, backgroundColor: "#e5e7eb" }),
  multiValueLabel: base => ({ ...base, color: "#1f2937" }),
  multiValueRemove: base => ({
    ...base,
    ":hover": { backgroundColor: "#f87171", color: "#fff" },
  }),
};

export default function Settings() {
  const [countryOptions,  setCountryOptions]  = useState([]);
  const [cityOptions,     setCityOptions]     = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [loadingCities,   setLoadingCities]   = useState(false);
  const [imgURL,          setImgURL]          = useState(null);
  const [errors,          setErrors]          = useState({});

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
    try {
      if (!validateForm()) {
        toast.error("Please fix the errors in the form");
        return;
      }
      await updateUser(form);
      toast.success("Settings saved!");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to save settings");
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

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">Notifications</h2>

          <label className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${whiteBox}`}>
            <input
              type="checkbox"
              checked={form.notifications.messages}
              onChange={() => toggleNotif("messages")}
              className="h-5 w-5 accent-indigo-600"
            />
            <span className="text-sm">Message alerts</span>
          </label>

          <label className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${whiteBox}`}>
            <input
              type="checkbox"
              checked={form.notifications.newFriends}
              onChange={() => toggleNotif("newFriends")}
              className="h-5 w-5 accent-indigo-600"
            />
            <span className="text-sm">Match with another traveler</span>
          </label>
        </section>

        <section className="flex flex-col gap-1 text-sm pt-2 border-t border-gray-300/30">
          <NavLink to="/help"    className="text-indigo-600 hover:underline self-start">Help &amp; Support</NavLink>
          <NavLink to="/privacy" className="text-indigo-600 hover:underline self-start">Privacy Center</NavLink>
          <NavLink to="/about"   className="text-indigo-600 hover:underline self-start">About TripMate</NavLink>
        </section>

        <button type="submit" className="btn-primary mt-4 rounded-xl">
          SAVE
        </button>
      </form>
    </div>
  );
}
