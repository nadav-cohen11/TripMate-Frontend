import React, { useState } from 'react';
import { login } from "../../api/userApi";
import TextInput from '@/components/ui/textInput';
import LoginButton from '@/components/ui/loginButton';



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
      className="h-[300px] bg-cover bg-center relative px-4 py-40"
      style={{ backgroundImage: "url('/assets/images/newBackground.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className=" text-[#2D4A53] p-7 w-full space-y-4">

        <p className="text-[#2D4A53] text-4xl font-bold text-center pb-20 pt-33">Welcome Back!</p>

        <div className='pb-1'>
          <TextInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pb-0.5"
            required
          />
        </div>

        <div className='pb-50'>
          <TextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pb-0.5"
            required
          />
        </div>

        <div className="text-center text-sm text-[#2D4A53] ">
          Don't have an account?{" "}
          <a href="/register" className="font-semibold underline hover:text-[#2D4A53]">
            Sign up
          </a>
        </div>


        <div>
          <LoginButton type="submit" className='text-white'>
            Log In <i className="bi bi-arrow-right ms-2"></i>
          </LoginButton>
        </div>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Login;
