import React, { useState, useEffect } from "react";
import Select from "react-select";

const genders = ["Female", "Male"];

const lookingOptions = [
  "Hiking", "Trekking", "Cycling", "Mountain Biking",
  "Climbing", "Camping", "Fishing", "Rafting", "Surfing",
  "Snorkeling", "Skiing", "Snowboarding", "Horseback Riding",
  "Photography", "Yoga Retreat", "Beach Relaxation", "Volunteering"
].map(opt => ({ value: opt, label: opt }));

const ProfileSetup = () => {
  const [languageOptions, setLanguageOptions] = useState([]);
  const [imgURL, setImgURL] = useState(null);
  const [form, setForm] = useState({
    dob: "",
    gender: "",
    location: "",
    languages: "",
    lookingFor: [],
    mates: 0,
    bio: ""
  });

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then(res => res.json())
      .then(data => {
        const langSet = new Set();
        data.forEach(country => {
          if (country.languages) {
            Object.values(country.languages).forEach(name => langSet.add(name));
          }
        });
        const opts = Array.from(langSet)
          .sort((a, b) => a.localeCompare(b))
          .map(name => ({ value: name, label: name }));
        setLanguageOptions(opts);
      })
      .catch(err => console.error("Error fetching languages:", err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setImgURL(URL.createObjectURL(file));
  };

  const handleMates = (delta) =>
    setForm(f => ({
      ...f,
      mates: f.mates === "" ? delta > 0 ? 1 : "" : Math.max(0, +f.mates + delta)
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({
      ...form,
      imgURL,
      lookingFor: form.lookingFor.map(opt => opt.value)
    });
    // send to backend
  };

  const selectedLanguage =
    languageOptions.find(o => o.value === form.languages) || null;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/assets/images/newBackground.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-50 backdrop-blur-md text-[#2D4A53] p-8 w-full max-w-md rounded-3xl shadow-xl flex flex-col gap-6"
      >
        <p className="text-[#2D4A53] text-4xl font-bold text-center">
          Create Your Profile
        </p>

        <div className="flex flex-col items-center gap-4">
          <div className="h-28 w-28 rounded-full bg-gray-300 flex items-center justify-center text-3xl overflow-hidden shadow-md">
            {imgURL && <img src={imgURL} alt="preview" className="h-full w-full object-cover rounded-full" />}
          </div>
          <label className="text-sm text-indigo-600 underline cursor-pointer">
            Upload profile picture
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="sr-only"
            />
          </label>
        </div>

        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="w-full input-basic border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full input-basic border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        >
          <option value="">Gender</option>
          {genders.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <input
          placeholder="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full input-basic border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />

        <Select
          name="languages"
          options={languageOptions}
          value={selectedLanguage}
          onChange={opt => setForm(f => ({ ...f, languages: opt?.value || "" }))}
          placeholder="Type to search languages..."
          isSearchable={true}
          filterOption={(option, inputValue) =>
            option.label.toLowerCase().startsWith(inputValue.toLowerCase())
          }
          className="w-full input-basic"
          classNamePrefix="react-select"
        />

        <Select
          isMulti
          name="lookingFor"
          options={lookingOptions}
          value={form.lookingFor}
          onChange={(selectedOptions) =>
            setForm(f => ({ ...f, lookingFor: selectedOptions }))
          }
          placeholder="Looking for?"
          className="w-full input-basic"
          classNamePrefix="react-select"
        />

        <textarea
          name="bio"
          placeholder="Bio (optional)"
          rows={2} // Reduced height
          value={form.bio}
          onChange={handleChange}
          className="w-full input-basic border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
        />

        <button
          type="submit"
          className="mt-4 mb-6 w-full bg-amber bg-cyan-900 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition-transform hover:scale-105"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;