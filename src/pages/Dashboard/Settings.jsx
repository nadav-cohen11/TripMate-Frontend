import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { updateUser } from "../../api/userApi";
import SettingsFormWrapper from "../../components/settings/SettingsFormWrapper";
import FormValidator from "../../components/settings/FormValidator";
import FormSubmitter from "../../components/settings/FormSubmitter";

export default function Settings() {
  const navigate = useNavigate();
  const [imgURL, setImgURL] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    country: "",
    location: "",
    languages: [],
    lookingFor: [],
    mates: 0,
    bio: "",
  });

  const validateForm = FormValidator(form, setErrors);
  const onSubmit = FormSubmitter(form, imgURL, isSubmitting, setIsSubmitting, navigate, validateForm);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/assets/images/newBackground.jpg')" }}
    >
      <SettingsFormWrapper
        form={form}
        setForm={setForm}
        errors={errors}
        setErrors={setErrors}
        imgURL={imgURL}
        setImgURL={setImgURL}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    </div>
  );
}