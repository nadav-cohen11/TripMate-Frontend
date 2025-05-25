import { useState } from 'react';
import ProfileSetup from '../ProfileSetUp';
import Register from './Register';

const MultiStepFormRegister = () => {
  const [step, setStep] = useState(1);
  const [formRegister, setFormRegister] = useState({
    email: '',
    password: '',
  });

  const nextStep = () => setStep((prev) => (prev < 2 ? prev + 1 : 2));

  if (step === 1) {
    return (
      <Register
        form={formRegister}
        nextStep={nextStep}
        setForm={setFormRegister}
      />
    );
  } else {
    return <ProfileSetup formRegister={formRegister} />;
  }
};

export default MultiStepFormRegister;
