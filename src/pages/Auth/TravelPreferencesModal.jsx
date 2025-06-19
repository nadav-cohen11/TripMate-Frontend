import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/api/userApi';
import { toast } from 'react-toastify';
import DatePicker from '@/components/ui/DatePicker';
import { Spinner } from '@/components/ui/spinner';

const TravelPreferencesModal = ({ isOpen, onClose, userId, currentPreferences }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    destinations: '',
    travelStyle: '',
    groupSize: '',
    travelDates: { start: '', end: '' },
    ageRange: { min: '', max: '' },
    interests: '',
  });

  useEffect(() => {
    if (currentPreferences) {
      setFormData({
        destinations: currentPreferences.destinations?.join(', ') || '',
        travelStyle: currentPreferences.travelStyle || '',
        groupSize: currentPreferences.groupSize || '',
        travelDates: {
          start: currentPreferences.travelDates?.start?.slice(0, 10) || '',
          end: currentPreferences.travelDates?.end?.slice(0, 10) || '',
        },
        ageRange: {
          min: currentPreferences.ageRange?.min || '',
          max: currentPreferences.ageRange?.max || '',
        },
        interests: currentPreferences.interests?.join(', ') || '',
      });
    }
  }, [currentPreferences]);

  const mutation = useMutation({
    mutationFn: (userData) => updateUser({ travelPreferences: userData }),
    onSuccess: () => {
      toast.success('Travel preferences updated!');
      queryClient.invalidateQueries(['user', userId]);
      onClose();
    },
    onError: () => toast.error('Update failed.'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'start' || name === 'end') {
      setFormData((prev) => ({
        ...prev,
        travelDates: { ...prev.travelDates, [name]: value },
      }));
    } else if (name === 'min' || name === 'max') {
      setFormData((prev) => ({
        ...prev,
        ageRange: { ...prev.ageRange, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const formatted = {
      destinations: formData.destinations.split(',').map((d) => d.trim()),
      travelStyle: formData.travelStyle,
      groupSize: Number(formData.groupSize),
      travelDates: formData.travelDates,
      ageRange: {
        min: Number(formData.ageRange.min),
        max: Number(formData.ageRange.max),
      },
      interests: formData.interests.split(',').map((i) => i.trim().toLowerCase()),
    };

    mutation.mutate(formatted);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-4 relative">

                {/* Optional: Overlay spinner while loading */}
                {mutation.isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl z-20">
                    <Spinner size={64} color="text-blue-500" />
                  </div>
                )}

                <Dialog.Title className="text-xl font-semibold text-blue-700">
                  ✈️ Edit Travel Preferences
                </Dialog.Title>

                <div className="space-y-4">
                  {/* Your inputs here (same as before) */}
                  {/* Destinations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destinations</label>
                    <input
                      type="text"
                      name="destinations"
                      value={formData.destinations}
                      onChange={handleChange}
                      placeholder="e.g. Paris, Rome"
                      className="input w-full"
                      disabled={mutation.isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <DatePicker
                        date={formData.travelDates.start}
                        handleInputChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            travelDates: { ...prev.travelDates, start: val },
                          }))
                        }
                        name="start"
                        disabled={mutation.isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <DatePicker
                        date={formData.travelDates.end}
                        handleInputChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            travelDates: { ...prev.travelDates, end: val },
                          }))
                        }
                        name="end"
                        disabled={mutation.isLoading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Group Size</label>
                    <input
                      type="number"
                      name="groupSize"
                      value={formData.groupSize}
                      onChange={handleChange}
                      className="input w-full"
                      min={1}
                      disabled={mutation.isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age Min</label>
                      <input
                        type="number"
                        name="min"
                        value={formData.ageRange.min}
                        onChange={handleChange}
                        className="input w-full"
                        min={0}
                        disabled={mutation.isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age Max</label>
                      <input
                        type="number"
                        name="max"
                        value={formData.ageRange.max}
                        onChange={handleChange}
                        className="input w-full"
                        min={0}
                        disabled={mutation.isLoading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interests</label>
                    <input
                      type="text"
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      placeholder="e.g. hiking, museums"
                      className="input w-full"
                      disabled={mutation.isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Travel Style</label>
                    <select
                      name="travelStyle"
                      value={formData.travelStyle}
                      onChange={handleChange}
                      className="input w-full"
                      disabled={mutation.isLoading}
                    >
                      <option value="">Select</option>
                      <option value="budget">Budget</option>
                      <option value="luxury">Luxury</option>
                      <option value="adventure">Adventure</option>
                      <option value="cultural">Cultural</option>
                      <option value="nature">Nature</option>
                      <option value="social">Social</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700"
                    disabled={mutation.isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={mutation.isLoading}
                    className="px-4 py-2 rounded-md bg-white text-blue-500 border border-blue-200 hover:bg-blue-50 text-sm font-semibold disabled:opacity-50"
                  >
                    {mutation.isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TravelPreferencesModal;
