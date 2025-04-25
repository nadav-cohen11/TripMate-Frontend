import React, { useState } from 'react';
import { login } from "../../api/userApi";
import TextInput from '@/components/ui/textInput';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.href = "/home";
    } catch (error) {
      setErrorMsg("Email or password incorrect");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative px-4 py-8"
      style={{ backgroundImage: "url('/assets/images/login-background.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className=" p-8 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center pb-40 mb-20 pt-25 text-black">Trip Mate</h2>

        <div className='pb-15'>
          <TextInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pb-0.5"
            required
          />
        </div>

        <div className='pb-80'>
          <TextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setEmail(e.target.value)}
            className="pb-0.5"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full  hover:cursor-pointer text-white p-2 rounded-md"
          >
            Log In
            <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Login;
