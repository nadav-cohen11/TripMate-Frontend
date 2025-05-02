import React, { useState, useEffect } from "react";
import Select from "react-select";

const genders = ["Female", "Male"];
const lookingOptions = [
  "Hiking","Trekking","Cycling","Mountain Biking","Climbing","Camping",
  "Fishing","Rafting","Surfing","Snorkeling","Skiing","Snowboarding",
  "Horseback Riding","Photography","Yoga Retreat","Beach Relaxation","Volunteering",
].map(v => ({ value: v, label: v }));

export default function ProfileSetup() {

  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions]       = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [loadingCities, setLoadingCities]   = useState(false);
  const [imgURL, setImgURL]                 = useState(null);

  const [form, setForm] = useState({
    dob:"", gender:"", country:"", location:"",
    languages: [], lookingFor: [], mates: 0, bio:""
  });

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then(r => r.json())
      .then(({data}) =>
        setCountryOptions(
          data.map(c => ({ value:c.name, label:c.name }))
              .sort((a,b)=>a.label.localeCompare(b.label))
        )
      ).catch(console.error);
  }, []);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then(r => r.json())
      .then(arr => {
        const set = new Set();
        arr.forEach(c => c.languages && Object.values(c.languages).forEach(l => set.add(l)));
        setLanguageOptions([...set].sort().map(l => ({ value:l, label:l })));
      }).catch(console.error);
  }, []);

  const loadCities = async country => {
    if (!country) return setCityOptions([]);
    setLoadingCities(true);
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ country })
        }
      );
      const { data=[] } = await res.json();
      setCityOptions(
        data.sort((a,b)=>a.localeCompare(b))
            .map(n => ({ value:n, label:n }))
      );
    } catch(err) {
      console.error(err); setCityOptions([]);
    } finally { setLoadingCities(false); }
  };

  const onInput  = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onFile   = e => { const f=e.target.files[0]; f && setImgURL(URL.createObjectURL(f)); };
  const onSubmit = e => {
    e.preventDefault();
    console.table({
      ...form,
      imgURL,
      languages:  form.languages.map(o=>o.value),
      lookingFor: form.lookingFor.map(o=>o.value)
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
         style={{ backgroundImage:"url('/assets/images/newBackground.jpg')" }}>

      <form onSubmit={onSubmit}
            className="bg-white/10 backdrop-blur-md text-[#2D4A53] p-8 w-full max-w-md rounded-3xl shadow-xl flex flex-col gap-6">

        <div className="flex flex-col items-center gap-4">
          <div className="h-28 w-28 rounded-full bg-gray-300 overflow-hidden shadow-md">
            {imgURL && <img src={imgURL} alt="avatar" className="h-full w-full object-cover"/>}
          </div>
          <label className="text-sm text-indigo-600 underline cursor-pointer">
            Upload profile picture
            <input type="file" accept="image/*" onChange={onFile} className="sr-only"/>
          </label>
        </div>

        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={onInput}
          required
          className="input-white"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={onInput}
          required
          className="input-white"
        >
          <option value="">Gender</option>
          {genders.map(g => <option key={g}>{g}</option>)}
        </select>

        <Select
          placeholder="Country"
          options={countryOptions}
          value={countryOptions.find(o=>o.value===form.country)||null}
          onChange={o=>{
            setForm(f=>({...f,country:o?.value||"", location:""}));
            loadCities(o?.value);
          }}
          isSearchable
          classNamePrefix="rs"
        />

        <Select
          placeholder={loadingCities ? "Loading cities…" : "City"}
          options={cityOptions}
          value={cityOptions.find(o=>o.value===form.location)||null}
          onChange={o=>setForm(f=>({...f, location:o?.value||""}))}
          isSearchable
          isDisabled={!form.country||loadingCities}
          classNamePrefix="rs"
        />

        <Select
          placeholder="Select languages…"
          options={languageOptions}
          isMulti
          value={form.languages}
          onChange={sel=>setForm(f=>({...f,languages:sel||[]}))}
          isSearchable
          classNamePrefix="rs"
        />

        <Select
          options={lookingOptions}
          isMulti
          placeholder="Looking for?"
          value={form.lookingFor}
          onChange={sel=>setForm(f=>({...f, lookingFor: sel}))}
          classNamePrefix="rs"
        />

        
        <textarea
          name="bio"
          rows={2}
          placeholder="Bio (optional)"
          value={form.bio}
          onChange={onInput}
          className="input-white resize-none"
        />

        <button type="submit" className="btn-primary mt-4 rounded-xl">SUBMIT</button>
      </form>
    </div>
  );
}
