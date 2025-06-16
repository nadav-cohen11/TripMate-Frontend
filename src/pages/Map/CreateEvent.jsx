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

    if (!form.name || !form.date || !form.location.address || !form.location.city || !form.location.country) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('date', form.date);
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
      setError('Failed to create event. Please try again.');
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Personal Event</DialogTitle>
          <DialogDescription>
            Add your own event to the map. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell us about your event..."
            />
          </div>
          <div>
            <Label htmlFor="date">Event Date *</Label>
            <DatePicker
              date={form.date}
              handleInputChange={handleChange}
              name="date"
            />
          </div>
          <div>
            <Label htmlFor="location.address">Address *</Label>
            <Input
              id="location.address"
              name="location.address"
              value={form.location.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="location.city">City *</Label>
            <Input
              id="location.city"
              name="location.city"
              value={form.location.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="location.country">Country *</Label>
            <Input
              id="location.country"
              name="location.country"
              value={form.location.country}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Event Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvent; 