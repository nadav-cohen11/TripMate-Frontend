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

  const [form, setForm] = useState({
    country: "", location: "",
    languages: [], lookingFor: [], mates: 0, bio: "",
    notifications: { messages: true, newFriends: true },
  });

  const onInput = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const toggleNotif = k =>
    setForm(f => ({
      ...f,
      notifications: { ...f.notifications, [k]: !f.notifications[k] },
    }));

  const onFile = e => {
    const f = e.target.files[0];
    f && setImgURL(URL.createObjectURL(f));
  };

  const onSubmit = e => {
    e.preventDefault();
    console.table({
      ...form,
      imgURL,
      languages:  form.languages.map(o => o.value),
      lookingFor: form.lookingFor.map(o => o.value),
    });
    toast.success("Settings saved!");
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
      const { data = [] } = await res.json();
      setCityOptions(
        data.sort((a, b) => a.localeCompare(b))
            .map(n => ({ value: n, label: n }))
      );
    } catch (err) {
      console.error(err);
      setCityOptions([]);
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
              setForm(f => ({ ...f, country: o?.value || "", location: "" }));
              loadCities(o?.value);
            }}
            isSearchable
            styles={whiteSelect}
          />
          <Select
            placeholder={loadingCities ? "Loading cities…" : "City"}
            options={cityOptions}
            value={cityOptions.find(o => o.value === form.location) || null}
            onChange={o => setForm(f => ({ ...f, location: o?.value || "" }))}
            isSearchable
            isDisabled={!form.country || loadingCities}
            styles={whiteSelect}
          />
        </section>

        <section className="flex flex-col gap-4">
          <Select
            placeholder="Select languages…"
            options={languageOptions}
            isMulti
            value={form.languages}
            onChange={sel => setForm(f => ({ ...f, languages: sel || [] }))}
            isSearchable
            styles={whiteSelect}
          />
          <Select
            options={lookingOptions}
            isMulti
            placeholder="Looking for?"
            value={form.lookingFor}
            onChange={sel => setForm(f => ({ ...f, lookingFor: sel }))}
            styles={whiteSelect}
          />
          <textarea
            name="bio"
            rows={2}
            placeholder="Bio (optional)"
            value={form.bio}
            onChange={onInput}
            className={`w-full px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${whiteBox} resize-none`}
          />
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
