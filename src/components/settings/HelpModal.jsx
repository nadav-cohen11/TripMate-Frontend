import React from 'react';
import Modal from './Modal';

const HelpModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help & Support">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">How can we help you?</h3>
        <div className="space-y-2">
          <p>Need assistance? Here are some ways to get help:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Email us at support@tripmate.com</li>
            <li>Check our FAQ section for common questions</li>
            <li>Join our community forum</li>
            <li>Contact us through social media</li>
          </ul>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Common Issues</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Account settings and preferences</li>
            <li>Profile customization</li>
            <li>Matching and connections</li>
            <li>Safety and security</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default HelpModal; 