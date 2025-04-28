import React, { useState, useEffect } from "react";
import Select from "react-select";

const genders = ["Female", "Male", "Other"];
const lookingOptions = ["Hiking", "Trekking",  "Cycling", "Mountain Biking",
   "Climbing", "Camping", "Fishing", "Rafting", "Surfing",
     "Snorkeling", "Skiing", "Snowboarding", "Horseback Riding",
      "Photography", "Yoga Retreat", "Beach Relaxation", "Volunteering"];

export default function ProfileSetup() {
  const [languageOptions, setLanguageOptions] = useState([]);
  const [imgURL, setImgURL] = useState(null);
  const [form, setForm] = useState({
    dob: "",
    gender: "",
    location: "",
    languages: "",
    lookingFor: "",
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
      mates:
        f.mates === ""
          ? delta > 0
            ? 1
            : ""
          : Math.max(0, +f.mates + delta)
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({ ...form, imgURL });
    // send to backend
  };

  const selectedLanguage =
    languageOptions.find(o => o.value === form.languages) || null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs bg-white rounded-2xl shadow-lg px-6 py-8 flex flex-col gap-5"
      >
        <div>
          <p className="text-sm text-gray-500">Welcome,</p>
          <h2 className="text-xl font-semibold">Traveller</h2>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl overflow-hidden">
            {imgURL && <img src={imgURL} alt="preview" className="h-full w-full object-cover" />}
          </div>
          <label className="text-xs text-indigo-600 underline cursor-pointer">
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
          className="input-basic"
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="input-basic"
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
          className="input-basic"
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
  className="input-basic"
  classNamePrefix="react-select"
/>

        <select
          name="lookingFor"
          value={form.lookingFor}
          onChange={handleChange}
          className="input-basic"
          required
        >
          <option value="">Looking for?</option>
          {lookingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>

        <div className="flex items-center justify-center gap-3">
          <span>Seeking</span>
          <div className="flex border rounded-lg overflow-hidden">
            <button type="button" className="px-2 select-none" onClick={() => handleMates(-1)}>–</button>
            <input
              type="number"
              min="0"
              value={form.mates}
              placeholder="0"
              onChange={e => setForm({ ...form, mates: e.target.value === "" ? "" : +e.target.value })}
              className="w-10 text-center outline-none"
            />
            <button type="button" className="px-2 select-none" onClick={() => handleMates(1)}>+</button>
          </div>
          <span>Travel&nbsp;Mates</span>
        </div>

        <textarea
          name="bio"
          placeholder="Bio (optional)"
          rows={3}
          value={form.bio}
          onChange={handleChange}
          className="input-basic resize-none"
        />

        <button
          type="submit"
          className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}
