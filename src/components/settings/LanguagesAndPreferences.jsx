import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { whiteSelect } from '../../styles/selectStyles';

const lookingOptions = [
  "Hiking", "Trekking", "Cycling", "Mountain Biking",
  "Climbing", "Camping", "Fishing", "Rafting", "Surfing",
  "Snorkeling", "Skiing", "Snowboarding", "Horseback Riding",
  "Photography", "Yoga Retreat", "Beach Relaxation", "Volunteering",
].map(v => ({ value: v, label: v }));

const LanguagesAndPreferences = ({ form, setForm, errors, setErrors }) => {
  const [languageOptions, setLanguageOptions] = useState([]);

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

  return (
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
        onChange={e => {
          setForm(f => ({ ...f, bio: e.target.value }));
          if (errors.bio) {
            setErrors(prev => ({ ...prev, bio: null }));
          }
        }}
        className="w-full px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white border border-gray-300 rounded-lg shadow-sm resize-none"
      />
      {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
    </section>
  );
};

export default LanguagesAndPreferences; 