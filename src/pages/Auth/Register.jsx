import { useState } from "react";
import { useNavigate } from "react-router-dom";  

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();               

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    navigate("/profile");                       
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100
                    bg-[url('/assets/bg.svg')] bg-top bg-no-repeat">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs sm:max-w-sm bg-white rounded-2xl
                   shadow-lg px-6 py-8 flex flex-col gap-4"
      >
        <h1 className="text-center text-3xl font-bold">Register</h1>

        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          className="w-full border border-gray-400 rounded-lg p-3
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="w-full border border-gray-400 rounded-lg p-3
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-400 rounded-lg p-3
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-400 rounded-lg p-3
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700
                     text-white font-medium py-3 rounded-lg transition-colors"
        >
          Let’s create your profile!
        </button>
      </form>
    </div>
  );
}
