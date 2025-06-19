import { useState } from 'react';
import ProfileSetup from '../UserProfile/ProfileSetUp';
import Register from './Register';
import UploadMediaPage from '../Auth/UploadMedia';
import Home from '../Home/Home';

const MultiStepFormRegister = () => {
  const [step, setStep] = useState(1);
  const [formRegister, setFormRegister] = useState({
    email: '',
    password: '',
  });

  const nextStep = () => setStep((prev) => (prev < 3 ? prev + 1 : 2));

  if (step === 1) {
    return (
      <Register
        form={formRegister}
        nextStep={nextStep}
        setForm={setFormRegister}
      />
    );
  }
   else if(step === 2) {
    return <ProfileSetup nextStep={nextStep} formRegister={formRegister} />;
  } else if (step === 3) {
    return <UploadMediaPage nextStep={nextStep} />;
  } else {
    return <Home></Home>
  }
};

export default MultiStepFormRegister;
