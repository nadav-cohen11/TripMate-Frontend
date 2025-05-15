import React from 'react';
import Modal from './Modal';

const AboutModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About TripMate">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Connecting Solo Travelers Worldwide</h3>
        <div className="space-y-2">
          <p>
            TripMate is a platform designed to help solo travelers connect, share experiences,
            and create meaningful connections around the world. Our mission is to make solo
            travel more enjoyable and safer by connecting like-minded travelers.
          </p>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Our Features</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Smart matching with compatible travelers</li>
            <li>Safe and verified user profiles</li>
            <li>Travel planning and coordination tools</li>
            <li>Community-driven travel tips and recommendations</li>
          </ul>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Our Values</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Safety and security for all users</li>
            <li>Authentic travel experiences</li>
            <li>Community building and support</li>
            <li>Cultural exchange and understanding</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal; 