import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Match from './Match';
import DatePicker from '@/components/ui/DatePicker';

const CreateTrip = ({ userId, socket, setChats, matches }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    tripName: '',
    country: '',
    description: '',
    city: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tripParticipants, setTripParticipants] = useState([{ _id: userId }]);

  useEffect(() => {
    setStep(1);
    setTripParticipants([{ _id: userId }]);
  }, [open]);

  const addFriendToTrip = (id) => {
    setTripParticipants((prev) => {
      return [...prev, id];
    });
  };

  const removeFriendFromTrip = (id) => {
    setTripParticipants((prev) =>
      prev.filter((participantId) => participantId !== id),
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStepOneValidation = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);
    if (
      !form.tripName ||
      !form.country ||
      !form.city ||
      !form.startDate ||
      !form.endDate
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (startDate < today) {
      setError('Start date cannot be before today.');
      setLoading(false);
      return;
    }

    if (endDate < startDate) {
      setError('End date cannot be before start date.');
      setLoading(false);
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (tripParticipants.length <= 1) {
      setError('Please pick at least one friend to join the trip.');
      setLoading(false);
      return;
    }
    try {
      const newTrip = {
        host: userId,
        chatName: form.tripName,
        participants: tripParticipants,
        groupSize: tripParticipants.length,
        destination: {
          country: form.country,
          city: form.city,
        },
        travelDates: {
          start: form.startDate,
          end: form.endDate,
        },
      };
      if (socket) {
        socket.emit('createTrip', { newTrip }, ({ chat, error }) => {
          if (error) {
            setError(error || 'Failed to create trip.');
            setLoading(false);
            return;
          }
          if (!chat) {
            setError('Failed to create trip.');
            setLoading(false);
            return;
          }
          setOpen(false);
        });
        setForm({
          tripName: '',
          country: '',
          description: '',
          city: '',
          startDate: '',
          endDate: '',
          notes: '',
        });
        setTripParticipants([{ _id: userId }]);
        setStep(1);
      } else {
        setLoading(false);
        setOpen(false);
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className='
              w-full sm:w-auto
              px-6 py-3
              rounded-xl
              bg-white
              text-[#4a90e2]
              border border-[#4a90e2]/20
              font-semibold
              shadow-lg
              hover:bg-[#4a90e2]/5
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#4a90e2]/20
              flex items-center gap-2
            '
            onClick={() => setOpen(true)}
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 4v16m8-8H4'
              />
            </svg>
            Create Your Trip
          </Button>
        </DialogTrigger>
        {open && (
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Create Your Trip</DialogTitle>
              <DialogDescription>
                Create a trip with your friends
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4'>
              {step === 1 ? (
                <form className='space-y-4' onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor='tripName'>Trip Name</Label>
                    <Input
                      id='tripName'
                      name='tripName'
                      placeholder='Our trip'
                      value={form.tripName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='country'>Country</Label>
                    <Input
                      id='country'
                      name='country'
                      placeholder='e.g. France'
                      value={form.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='city'>City</Label>
                    <Input
                      id='city'
                      name='city'
                      placeholder='e.g. Paris'
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='startDate'>Start Date</Label>
                    
                    <DatePicker
                      date={form.startDate}
                      handleInputChange={handleChange}
                      name={'Start Date'}
                    />
                  </div>
                  <div>
                    <Label htmlFor='endDate'>End Date</Label>
                    
                    <DatePicker
                      date={form.endDate}
                      handleInputChange={handleChange}
                      name={'End Date'}
                    />
                  </div>
                  <div>
                    <Label htmlFor='description'>Notes</Label>
                    <Textarea
                      id='description'
                      name='description'
                      placeholder='Trip details...'
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>
                  {error && <div className='text-red-500 text-sm'>{error}</div>}
                  <Button
                    type='button'
                    className='
                      w-full
                      px-6 py-3
                      rounded-xl
                      bg-white
                      text-[#4a90e2]
                      border border-[#4a90e2]/20
                      font-semibold
                      shadow-lg
                      hover:bg-[#4a90e2]/5
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-[#4a90e2]/20
                      flex items-center gap-2
                    '
                    onClick={handleStepOneValidation}
                  >
                    Next
                  </Button>
                </form>
              ) : (
                <form className='space-y-4' onSubmit={handleSubmit}>
                  <div className='grid gap-4 py-4'>
                    {matches && matches.length > 0 ? (
                      matches.map((match) => (
                        <Match
                          key={match._id}
                          userId={userId}
                          match={match}
                          socket={socket}
                          setChats={setChats}
                          buttonContent='Add'
                          addFriendToTrip={addFriendToTrip}
                          removeFriendFromTrip={removeFriendFromTrip}
                        />
                      ))
                    ) : (
                      <div className='text-center text-gray-500 py-8'>
                        No friends found.
                      </div>
                    )}
                  </div>
                  {error && <div className='text-red-500 text-sm'>{error}</div>}
                  <Button
                    type='submit'
                    className='
                      w-full
                      px-6 py-3
                      rounded-xl
                      bg-gradient-to-r from-blue-500 to-indigo-600
                      text-white
                      font-semibold
                      shadow-lg
                      hover:from-blue-600 hover:to-indigo-700
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-400
                      flex items-center gap-2
                    '
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Trip'}
                  </Button>
                </form>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default CreateTrip;
