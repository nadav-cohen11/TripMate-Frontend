import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQrCodeByUserId } from '../../api/userApi';
import { useParams } from 'react-router-dom';
import { QrCode } from 'lucide-react';

const UserQRCode = () => {
  const { userId } = useParams();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { data: qrCode, isLoading, isError } = useQuery({
    queryKey: ['qrCode', userId],
    queryFn: () => getQrCodeByUserId(userId),
    enabled: !!userId,
  });

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <div className="relative z-30">
      <div className="group relative">
        <button
          onClick={togglePopup}
          className="p-2 rounded-full bg-gray-300 hover:bg-blue-700 transition-all shadow-md text-white"
          aria-label="Show QR Code"
        >
          <QrCode className="w-5 h-5" />
        </button>
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Show QR Code
        </span>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 bg-opacity-95 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 relative animate-fade-in">
            <button
              onClick={togglePopup}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>

            {isLoading ? (
              <p className="text-center text-gray-500">Generating QR code...</p>
            ) : isError ? (
              <p className="text-center text-red-500">Failed to load QR code.</p>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-700">Scan My Profile</h3>
                <img
                  src={qrCode}
                  alt="User QR Code"
                  className="w-40 h-40 object-contain rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserQRCode;
