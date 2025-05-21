import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { login } from '@/api/userApi';
import { getCurrentLocation } from '@/utils/getLocationUtiles';
import { extractBackendError } from '@/utils/errorUtils';
import { AuthContext } from '@/context/AuthContext';
import TextInput from '@/components/ui/textInput';
import LoginButton from '@/components/ui/loginButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useContext(AuthContext);

  const from = location.state?.from?.pathname || '/home';

  const loginMutation = useMutation({
    mutationFn: async () => {
      const coordinates = await getCurrentLocation();
      return await login(email, password, coordinates);
    },
    onSuccess: async () => {
      await checkAuth();
      navigate(from, { replace: true });
    },
    onError: (err) => {
      const message = extractBackendError(err);
      toast.error(message || 'Login failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate();
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

        <div className="pb-1">
          <TextInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="pb-1">
          <TextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="pt-6">
          <LoginButton type="submit" disabled={loginMutation.isLoading}>
            {loginMutation.isLoading ? 'Logging in...' : 'Login'}
            <i className="bi bi-arrow-right ms-2"></i>
          </LoginButton>
        </div>

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
