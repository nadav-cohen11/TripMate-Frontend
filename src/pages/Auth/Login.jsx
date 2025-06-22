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
import TripMateTitle from '@/components/ui/TripMateTitle';

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
    try {
      const location = await getCurrentLocation();
      mutation.mutate({ email, password, location });
    } catch (error) {
      mutation.mutate({ email, password, location: [] });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-[#e6f0ff] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <TripMateTitle />
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            bg-white
            rounded-3xl
            shadow-xl
            p-6
            sm:p-8
            flex
            flex-col
            gap-4
            sm:gap-6
            text-[#4a90e2]
            transition-all
            duration-300
          "
        >
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4a90e2]">
              Welcome Back
            </h1>
            <p className="text-blue-400 mt-2">Sign in to continue your journey</p>
          </div>

          <div className="space-y-4">
            <TextInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full
                bg-white
                border
                border-blue-100
                rounded-xl
                px-4
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-blue-200
                text-[#4a90e2]
                placeholder:text-blue-200
              "
            />

            <TextInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full
                bg-white
                border
                border-blue-100
                rounded-xl
                px-4
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-blue-200
                text-[#4a90e2]
                placeholder:text-blue-200
              "
            />
          </div>

          <LoginButton
            type="submit"
            className="
              w-full
              !bg-[#4a90e2]
              !hover:bg-[#4a90e2]
              text-white
              rounded-xl
              py-2
              font-medium
              transition
              shadow-lg
              shadow-blue-200/25
            "
          >
            Sign In <i className="bi bi-arrow-right ms-2"></i>
          </LoginButton>

          <div className="text-center text-sm text-[#4a90e2] pt-4">
            Don't have an account?{' '}
            <a
              href="/register"
              className="
                font-semibold
                text-blue-400
                hover:text-blue-500
                transition-colors
                duration-300
              "
            >
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
