import { useState } from 'react';
import ProfileSetup from '../ProfileSetUp';
import Register from './Register';
import UploadTestPage from '../test/UploadTestPage';

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
   else if( step === 2) {
    return <ProfileSetup nextStep={nextStep} formRegister={formRegister} />;
  }else{       
    return <UploadTestPage></UploadTestPage>
  }
};

export default MultiStepFormRegister;