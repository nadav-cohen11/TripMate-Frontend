import React from 'react';
import ProfilePictureUploader from './ProfilePictureUploader';
import CountryAndCitySelect from './CountryAndCitySelect';
import LanguagesAndPreferences from './LanguagesAndPreferences';
import AboutModal from './AboutModal';
import HelpModal from './HelpModal';
import PrivacyModal from './PrivacyModal';

const SettingsFormWrapper = ({
  form,
  setForm,
  errors,
  setErrors,
  imgURL,
  setImgURL,
  activeModal,
  setActiveModal,
  isSubmitting,
  onSubmit
}) => {
  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white/10 backdrop-blur-md text-[#2D4A53] p-8 w-full max-w-lg rounded-3xl shadow-xl flex flex-col gap-8"
    >
      <ProfilePictureUploader imgURL={imgURL} setImgURL={setImgURL} />
      
      <CountryAndCitySelect
        form={form}
        setForm={setForm}
        errors={errors}
        setErrors={setErrors}
      />

      <LanguagesAndPreferences
        form={form}
        setForm={setForm}
        errors={errors}
        setErrors={setErrors}
      />

      <section className="flex flex-col gap-1 text-sm pt-2 border-t border-gray-300/30">
        <button
          type="button"
          onClick={() => openModal('help')}
          className="text-indigo-600 hover:underline self-start text-left"
        >
          Help &amp; Support
        </button>
        <button
          type="button"
          onClick={() => openModal('privacy')}
          className="text-indigo-600 hover:underline self-start text-left"
        >
          Privacy Center
        </button>
        <button
          type="button"
          onClick={() => openModal('about')}
          className="text-indigo-600 hover:underline self-start text-left"
        >
          About TripMate
        </button>
      </section>

      <button 
        type="submit" 
        className={`btn-primary mt-4 rounded-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'SAVING...' : 'SAVE'}
      </button>

      <HelpModal isOpen={activeModal === 'help'} onClose={closeModal} />
      <PrivacyModal isOpen={activeModal === 'privacy'} onClose={closeModal} />
      <AboutModal isOpen={activeModal === 'about'} onClose={closeModal} />
    </form>
  );
};

export default SettingsFormWrapper; 