import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { register } from '@/api/userApi';
import TextInput from '@/components/ui/textInput';
import LoginButton from '@/components/ui/loginButton';
import { registerSchema } from '@/schemas/registerSchema';
//maybe the import should not be commented, need to check after merge to main 
//import { extractBackendError } from '../../utils/errorUtils';

export default function Register() {
  useEffect(() => {
    console.log('=== ENVIRONMENT VARIABLES CHECK ===');
    console.log('Mode:', import.meta.env.VITE_MODE);
    console.log('Test Email:', import.meta.env.VITE_TEST_EMAIL);
    console.log('Test Password:', import.meta.env.VITE_TEST_PASSWORD);
    console.log('================================');
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (name === 'confirmPassword' || name === 'password') {
      if (
        form.password &&
        form.confirmPassword &&
        form.password !== form.confirmPassword
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: null }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorMsg("");

    try {
      registerSchema.parse(form);

      const { confirmPassword, ...userData } = form;

      if (import.meta.env.VITE_MODE === 'dev') {
        const isValid =
          userData.email === import.meta.env.VITE_TEST_EMAIL &&
          userData.password === import.meta.env.VITE_TEST_PASSWORD;
        if (!isValid) {
          setErrorMsg('Invalid email or password');
          return;
        }
      }

      await register(userData);
      navigate('/profile');
    } catch (err) {
      if (err?.errors) {
        const newErrors = {};
        err.errors.forEach((error) => {
          const field = error.path[0];
          newErrors[field] = error.message;
          toast.error(error.message);
        });
        setErrors(newErrors);
      } else {
        const message = extractBackendError(err);
        toast.error(message);
      }
    }
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
          <TextInput
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            error={errors.fullName}
          />
          <TextInput
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            error={errors.email}
          />
          <TextInput
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            error={errors.password}
          />
          <TextInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword}
          />
          {errorMsg && (
            <div className="text-red-600 text-sm text-center mt-2">
              {errorMsg}
            </div>
          )}
        </div>
        <div className="pt-6">
          <LoginButton type="submit">
            Create Account<i className="bi bi-arrow-right ms-2"></i>
          </LoginButton>
        </div>
      </form>
    </div>
  );
}
