import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from "@/api/userApi";
import { z } from 'zod';
import { toast } from 'sonner';
import { extractBackendError } from '../../utils/errorUtils'
import TextInput from '@/components/ui/textInput';
import LoginButton from '@/components/ui/loginButton';

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        schema.parse(form);
        await register(form);
        navigate('/profile');
      } catch (err) {
        const message = extractBackendError(err);
        toast.error(message);
      }
    };

  return (
    <div
      className="h-[300px] bg-[url('/assets/images/newBackground.jpg')] bg-cover bg-center relative px-4 pt-[380px] pb-20"
    >
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
        />

        <TextInput
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <TextInput
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
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