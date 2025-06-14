import { toast } from 'react-toastify';
import { useState } from 'react';
import TextInput from '@/components/ui/textInput';
import LoginButton from '@/components/ui/loginButton';
import schema from '@/schemas/passwordSchema.js';
import TermsModal from './TermsModal';
import TripMateTitle from '@/components/ui/TripMateTitle';
import { useMutation } from '@tanstack/react-query';
import { getUserByEmail } from '@/api/userApi';

const Register = ({ nextStep, form, setForm }) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleChange = (e) => {
    if (e.target.type === 'checkbox') {
      setForm({ ...form, [e.target.name]: e.target.checked });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const checkEmailExistMutation = useMutation({
    mutationFn: () => getUserByEmail(form.email),
    onSuccess: () => {
      toast.error('User with this email already exists');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await checkEmailExistMutation
        .mutateAsync()
        .catch(() => null);
      if (result) return;
      schema.parse(form);
      nextStep();
    } catch (err) {
      toast.error(err.errors?.[0]?.message || 'Invalid input');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-[#e6f0ff] px-4">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4a90e2] mb-2">
              Create Your Account
            </h1>
          </div>
          <TextInput
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
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
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
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
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={form.termsAccepted || false}
              onChange={handleChange}
              className="mt-1 accent-blue-400"
              required
            />
            <label className="text-sm text-[#4a90e2]">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="text-blue-400 hover:text-blue-500 underline"
              >
                Terms of Use
              </button>
            </label>
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
            Create Account <i className="bi bi-arrow-right ms-2"></i>
          </LoginButton>
        </form>
      </div>

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
};

export default Register;
