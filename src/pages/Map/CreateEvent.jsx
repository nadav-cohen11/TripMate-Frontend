import { useState } from 'react';
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
import DatePicker from '@/components/ui/DatePicker';
import { PlusIcon } from 'lucide-react';
import api from '@/api/axios';

const CreateEvent = ({ onEventCreated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: {
      address: '',
      city: '',
      country: '',
    },
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.name || !form.date || !form.time || !form.location.address || !form.location.city || !form.location.country) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('date', `${form.date}T${form.time}:00`);
      formData.append('address', form.location.address);
      formData.append('city', form.location.city);
      formData.append('country', form.location.country);
      if (form.image) {
        formData.append('image', form.image);
      }

      const response = await api.post('/trips/events/create', formData);
      
      if (response.data) {
        setOpen(false);
        setForm({
          name: '',
          description: '',
          date: '',
          time: '',
          location: {
            address: '',
            city: '',
            country: '',
          },
          image: null,
        });
        if (onEventCreated) {
          onEventCreated(response.data);
        }
      }
    } catch (err) {
      console.error('Error creating event:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(`Failed to create event: ${err.message}`);
      } else {
        setError('Failed to create event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-[#4a90e2] text-white hover:bg-[#357abd]">
          <PlusIcon size={20} />
          <span>Add Personal Event</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg bg-white shadow-xl max-w-lg p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-[#4a90e2]">Create Personal Event</DialogTitle>
          <DialogDescription className="text-md text-[#4a90e2]">
            Add your own event to the map. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="block text-[#4a90e2] font-semibold mb-2">Event Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <Label htmlFor="description" className="block text-[#4a90e2] font-semibold mb-2">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell us about your event..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <Label htmlFor="date" className="block text-[#4a90e2] font-semibold mb-2">Event Date <span className="text-red-500">*</span></Label>
            <DatePicker
              date={form.date}
              handleInputChange={handleChange}
              name="date"
            />
          </div>
          <div>
            <Label htmlFor="time" className="block text-[#4a90e2] font-semibold mb-2">Event Time <span className="text-red-500">*</span></Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <Label htmlFor="location.address" className="block text-[#4a90e2] font-semibold mb-2">Address <span className="text-red-500">*</span></Label>
            <Input
              id="location.address"
              name="location.address"
              value={form.location.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <Label htmlFor="location.city" className="block text-[#4a90e2] font-semibold mb-2">City <span className="text-red-500">*</span></Label>
            <Input
              id="location.city"
              name="location.city"
              value={form.location.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <Label htmlFor="location.country" className="block text-[#4a90e2] font-semibold mb-2">Country <span className="text-red-500">*</span></Label>
            <Input
              id="location.country"
              name="location.country"
              value={form.location.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <Label htmlFor="image" className="block text-[#4a90e2] font-semibold mb-2">Event Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-[#4a90e2] text-white py-3 rounded-xl hover:bg-[#357abd] transition-colors text-lg" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvent; 