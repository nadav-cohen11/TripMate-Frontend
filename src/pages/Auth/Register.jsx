import { toast } from 'react-toastify';
import TextInput from '@/components/ui/textInput';
import LoginButton from '@/components/ui/loginButton';
import schema from '@/schemas/passwordSchema.js';

const Register = ({ nextStep, form, setForm }) => {
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      schema.parse(form);
      nextStep();
    } catch (err) {
      toast.error(err.errors[0]?.message || 'Invalid input');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf4ff] to-[#dbeeff] px-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md flex flex-col gap-6 text-[#2D4A53] transition-all duration-300'
      >
        <p className='text-3xl font-bold text-center mb-2'>
          Create Your Account
        </p>
        <TextInput
          type='email'
          name='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          required
          className='bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
        />
        <TextInput
          type='password'
          name='password'
          placeholder='Password'
          value={form.password}
          onChange={handleChange}
          required
          className='bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
        />
        <LoginButton
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2 font-medium transition'
        >
          Create Account<i className='bi bi-arrow-right ms-2'></i>
        </LoginButton>
      </form>
    </div>
  );
};

export default Register;

