import React, { useState } from 'react';
import { login } from "../../api/userApi";
import { toast } from 'react-toastify';
import TextInput from '@/components/ui/textInput';
import LoginButton from '@/components/ui/loginButton';
import { useNavigate } from 'react-router-dom'
import { extractBackendError } from '../../utils/errorUtils'
import { getCurrentLocation } from '@/utils/getLocationUtiles';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const location = await getCurrentLocation();
      await login(email, password, location);
      navigate('/home');
    } catch (err) {
      const message = extractBackendError(err);
      toast.error(message || err.message || "Login failed");
    }
  };

  return (
    <div
      className="h-[300px] bg-cover bg-center relative px-4 pt-40 pb-60"
      style={{ backgroundImage: "url('/assets/images/newBackground.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="text-[#2D4A53] p-7 w-full space-y-4"
      >
        <p className="text-[#2D4A53] text-4xl font-bold text-center pt-44 pb-20">
          Welcome Back!
        </p>

        <div className='pb-1'>
          <TextInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='pb-1'>
          <TextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className='pt-1'>
          <LoginButton
            type="submit"
            className="text-white w-full h-12 rounded-full"
          >
            Log In <i className="bi bi-arrow-right ms-2"></i>
          </LoginButton>
        </div>

        <div className="text-center text-sm text-[#2D4A53] pt-4">
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
      </form>
    </div>
  );
};

export default Login;
