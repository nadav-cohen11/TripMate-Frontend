import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/api/userApi';
import { toast } from 'react-toastify';
import DatePicker from '@/components/ui/DatePicker';
import { Spinner } from '@/components/ui/spinner';
import { lookingOptions, travelStyle } from '../../constants/profile';
import Select from '@/components/ui/Select';


const inputStyle =
  'w-full border border-gray-300 rounded-md px-3 py-2 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50';

const travelInterestsOptions = lookingOptions.map((opt) => ({ value: opt, label: opt }));


const normalizeInterests = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map((i) => {
    const match = lookingOptions.find((opt) => opt.toLowerCase() === i.trim().toLowerCase());

    return match || i.trim();
  });
};

const TravelPreferencesModal = ({
  isOpen,
  onClose,
  userId,
  currentPreferences,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    destinations: '',
    travelStyle: '',
    groupSize: '',
    travelDates: { start: '', end: '' },
    ageRange: { min: '', max: '' },
    interests: normalizeInterests(
      Array.isArray(currentPreferences.interests)
        ? currentPreferences.interests
        : currentPreferences.interests
        ? currentPreferences.interests.split(',')
        : []

    ),
  });

  useEffect(() => {
    if (currentPreferences) {
      setFormData({
        destinations: Array.isArray(currentPreferences.destinations)
          ? currentPreferences.destinations.join(', ')
          : currentPreferences.destinations || '',
        travelStyle: currentPreferences.travelStyle || '',
        groupSize: currentPreferences.groupSize || '',
        travelDates: {
          start: currentPreferences.travelDates?.start
            ? new Date(currentPreferences.travelDates.start).toLocaleDateString(
                'en-CA',
              )
            : '',
          end: currentPreferences.travelDates?.end
            ? new Date(currentPreferences.travelDates.end).toLocaleDateString(
                'en-CA',
              )
            : '',
        },
        ageRange: {
          min: currentPreferences.ageRange?.min || '',
          max: currentPreferences.ageRange?.max || '',
        },
        interests: normalizeInterests(
          Array.isArray(currentPreferences.interests)
            ? currentPreferences.interests
            : currentPreferences.interests
            ? currentPreferences.interests.split(',')
            : []
        ),
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

  const formatted = {};
  if (formData.destinations.trim()) {
    formatted.destinations = formData.destinations
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
  }
  if (formData.travelStyle) {
    formatted.travelStyle = formData.travelStyle;
  }
  if (formData.groupSize) {
    formatted.groupSize = Number(formData.groupSize);
  }
  if (formData.travelDates.start || formData.travelDates.end) {
    formatted.travelDates = {};
    if (formData.travelDates.start) {
      formatted.travelDates.start = new Date(formData.travelDates.start);
    }
    if (formData.travelDates.end) {
      formatted.travelDates.end = new Date(formData.travelDates.end);
    }
  }
  if (formData.ageRange.min || formData.ageRange.max) {
    formatted.ageRange = {};
    if (formData.ageRange.min) {
      formatted.ageRange.min = Number(formData.ageRange.min);
    }
    if (formData.ageRange.max) {
      formatted.ageRange.max = Number(formData.ageRange.max);
    }
  }
  if (Array.isArray(formData.interests) && formData.interests.length > 0) {
    formatted.interests = Array.from(new Set(formData.interests));
  }

  const handleSubmit = () => {
    if (
      formatted.travelDates &&
      (formatted.travelDates.start || formatted.travelDates.end)
    ) {
      if (!formatted.travelDates.start || !formatted.travelDates.end) {
        toast.error('Please provide both start and end dates.');
        return;
      }
      const now = new Date();
      if (formatted.travelDates.start < now) {
        toast.error('Start date must be in the future.');
        return;
      }
      if (formatted.travelDates.end <= formatted.travelDates.start) {
        toast.error('End date must be after start date.');
        return;
      }
    }
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
                {mutation.isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl z-20">
                    <Spinner size={64} color="text-blue-500" />
                  </div>
                )}

                <Dialog.Title className="text-xl font-semibold text-blue-700">✈️ Edit Travel Preferences</Dialog.Title>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destinations</label>
                    <input
                      type="text"
                      name="destinations"
                      value={formData.destinations}
                      onChange={handleChange}
                      placeholder="e.g. Paris, Rome"
                      className={inputStyle}
                      disabled={mutation.isLoading}
                    />
                  </div>

                  <div className="block text-sm font-medium text-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <DatePicker
                        date={formData.travelDates.start}
                        handleInputChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            travelDates: {
                              ...prev.travelDates,
                              start: e.target.value,
                            },
                          }))
                        }
                        name="start"
                        placeHolder="Start"
                        inputClassName={inputStyle}
                        disabled={mutation.isLoading}
                      />
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <DatePicker
                          date={formData.travelDates.end}
                          handleInputChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              travelDates: {
                                ...prev.travelDates,
                                end: e.target.value,
                              },
                            }))
                          }
                          name="end"
                          placeHolder="End"
                          inputClassName={inputStyle}
                          disabled={mutation.isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="grid gap-4 col-span-2">Group Size</label>
                      <input
                        type="number"
                        name="groupSize"
                        value={formData.groupSize}
                        onChange={handleChange}
                        className={inputStyle}
                        min={1}
                        disabled={mutation.isLoading}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 col-span-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Age Min</label>
                        <input
                          type="number"
                          name="min"
                          value={formData.ageRange.min}
                          onChange={handleChange}
                          className={inputStyle}
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
                          className={inputStyle}
                          min={0}
                          disabled={mutation.isLoading}
                        />
                      </div>
                    </div>

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interests</label>
                    <Select
                      name="interests"
                      value={formData.interests}
                      onChange={(vals) =>
                        setFormData((prev) => ({ ...prev, interests: Array.from(new Set(vals)) }))
                      }
                      options={travelInterestsOptions}
                      isMulti
                      placeholder="Select interests..."
                      classNamePrefix="react-select" 
                      className="react-select-container"
                      disabled={mutation.isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Travel Style</label>
                    <select
                      name="travelStyle"
                      value={formData.travelStyle}
                      onChange={handleChange}
                      className={inputStyle}
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

                  <div className="flex justify-end gap-3 pt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 disabled:opacity-50"
                      disabled={mutation.isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={mutation.isLoading}
                      className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
                    >
                      {mutation.isLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
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
