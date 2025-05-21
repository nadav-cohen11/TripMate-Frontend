import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { register } from '@/api/userApi';
import { getCurrentLocation } from '@/utils/getLocationUtiles';
import { extractBackendError } from '@/utils/errorUtils';
import TextInput from '@/components/ui/textInput';
import LoginButton from '@/components/ui/loginButton';

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const registerMutation = useMutation({
    mutationFn: async () => {
      const result = schema.safeParse(form);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors(fieldErrors);
        throw new Error("Validation failed");
      }

      const coordinates = await getCurrentLocation();
      return await register({ ...form, location: coordinates });
    },
    onSuccess: (res) => {
      if (res?.status === 201) {
        navigate('/profile');
      }
    },
    onError: (err) => {
      if (err.message === "Validation failed") return;
      const message = extractBackendError(err) || 'An unexpected error occurred. Please try again.';
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  return (
    <div className="h-[300px] bg-[url('/assets/images/newBackground.jpg')] bg-cover bg-center relative px-4 pt-[380px] pb-20">
      <form
        onSubmit={handleSubmit}
        className="text-[#2D4A53] p-7 w-full max-w-md mx-auto bg-white bg-opacity-90 rounded-2xl shadow-lg"
      >
        <p className="text-[#2D4A53] text-4xl font-bold text-center mb-8">
          Create Your Account
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <TextInput
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <TextInput
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <TextInput
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <div className="pt-6">
          <LoginButton type="submit" disabled={registerMutation.isLoading}>
            {registerMutation.isLoading ? 'Creating...' : 'Create Account'}
            <i className="bi bi-arrow-right ms-2"></i>
          </LoginButton>
        </div>
      </form>
    </div>
  );
}
