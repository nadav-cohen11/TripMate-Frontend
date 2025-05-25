import { useState, useContext } from 'react';
import { login } from '../../api/userApi';
import { toast } from 'react-toastify';
import TextInput from '@/components/ui/textInput';
import LoginButton from '@/components/ui/loginButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { extractBackendError } from '../../utils/errorUtils';
import { getCurrentLocation } from '@/utils/getLocationUtiles';
import { AuthContext } from '../../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import Typewriter from '@/components/Typewriter';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useContext(AuthContext);
  const from = location.state?.from?.pathname || '/home';

  const mutation = useMutation({
    mutationFn: async ({ email, password, location }) => {
      await login(email, password, location);
      await checkAuth();
    },
    onSuccess: () => {
      navigate(from, { replace: true });
    },
    onError: (err) => {
      const message = extractBackendError(err);
      toast.error(message || err.message || 'Login failed');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let location = await getCurrentLocation();
    if (!location) location = [];
    mutation.mutate({ email, password, location });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf4ff] to-[#dbeeff] px-4">
      <div className="absolute top-6 left-6 z-20">
        <Typewriter
          text="TripMate"
          className="text-4xl text-black font-bold tracking-wide"
          style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md flex flex-col gap-6 text-[#2D4A53] transition-all duration-300"
      >
         <p className="text-3xl font-bold text-center mb-2">
          Log in
        </p>

        <TextInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <TextInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <LoginButton
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2 font-medium transition"
        >
          Log In <i className="bi bi-arrow-right ms-2"></i>
        </LoginButton>

        <div className="text-center text-sm text-[#2D4A53] pt-4">
          Don't have an account?{' '}
          <a
            href="/register"
            className="font-semibold underline hover:text-[#2D4A53]"
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
