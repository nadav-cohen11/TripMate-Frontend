import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '@/components/ui/textInput';
import LoginButton from '@/components/ui/loginButton';

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
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
    <div
      className="h-[300px] bg-cover bg-center relative px-4 pt-[380px] pb-20"
      style={{ backgroundImage: "url('/assets/images/newBackground.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="text-[#2D4A53] p-7 w-full max-w-md mx-auto bg-white bg-opacity-90 rounded-2xl shadow-lg"
      >
        <p className="text-[#2D4A53] text-4xl font-bold text-center mb-8">
          Create Your Account
        </p>
        <div className="space-y-20">

        <TextInput
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
          className="mb-20"
        />

        <TextInput
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="mb-20" 
        />

        <TextInput
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="mb-20"
        />
</div>

        <div className="pt-6">
          <LoginButton type="submit" className="text-white w-full">
            Create Account <i className="bi bi-arrow-right ms-2"></i>
          </LoginButton>
        </div>
      </form>
    </div>
  );
}