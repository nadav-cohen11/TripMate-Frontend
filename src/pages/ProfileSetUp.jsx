import { useState } from "react";

const genders        = ["Female", "Male", "Other"];
const lookingOptions = ["Hiking", "Cycling", "Climbing", "Camping", "Other"];

export default function ProfileSetup() {
  const [imgURL, setImgURL] = useState(null);
  const [form, setForm] = useState({
    dob: "",
    gender: "",
    location: "",
    languages: "",
    lookingFor: "",
    mates: 0,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setImgURL(URL.createObjectURL(file));
  };

  const handleMates = (delta) =>
    setForm((f) => ({
      ...f,
      mates:
        f.mates === ""
          ? delta > 0
            ? 1
            : ""
          : Math.max(0, +f.mates + delta),
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.table({ ...form, imgURL });
    //send to backend!
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs bg-white rounded-2xl shadow-lg
                   px-6 py-8 flex flex-col gap-5"
      >
       
        <div>
          <p className="text-sm text-gray-500">Welcome,</p>
          <h2 className="text-xl font-semibold">Traveller</h2>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center
                          justify-center text-3xl overflow-hidden">
            {imgURL ? (
              <img src={imgURL} alt="preview" className="h-full w-full object-cover" />
            ) : (
              ""
            )}
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
          {genders.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <input
          placeholder="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="input-basic"
          required
        />

        <input
          placeholder="Languages"
          name="languages"
          value={form.languages}
          onChange={handleChange}
          className="input-basic"
        />

        <select
          name="lookingFor"
          value={form.lookingFor}
          onChange={handleChange}
          className="input-basic"
          required
        >
          <option value="">Looking for?</option>
          {lookingOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>

        <div className="flex items-center justify-center gap-3">
          <span>Seeking</span>
          <div className="flex border rounded-lg overflow-hidden">
            <button
              type="button"
              className="px-2 select-none"
              onClick={() => handleMates(-1)}
            >
              –
            </button>
            <input
              type="number"
              min="0"
              value={form.mates}
              placeholder="0"
              onChange={(e) =>
                setForm({
                  ...form,
                  mates: e.target.value === "" ? "" : +e.target.value,
                })
              }
              className="w-10 text-center outline-none"
            />
            <button
              type="button"
              className="px-2 select-none"
              onClick={() => handleMates(1)}
            >
              +
            </button>
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
          className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700
                     text-white font-semibold py-3 rounded-lg transition-colors"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}
