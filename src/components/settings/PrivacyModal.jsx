import React from 'react';
import Modal from './Modal';

const PrivacyModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Center">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Privacy Matters</h3>
        <div className="space-y-2">
          <p>At TripMate, we take your privacy seriously. Here's how we protect your data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your personal information is encrypted and secure</li>
            <li>You control who sees your profile and information</li>
            <li>We never share your data with third parties without consent</li>
            <li>You can delete your account and data at any time</li>
          </ul>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Privacy Settings</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Profile visibility controls</li>
            <li>Location sharing preferences</li>
            <li>Data usage and storage</li>
            <li>Communication preferences</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default PrivacyModal; 