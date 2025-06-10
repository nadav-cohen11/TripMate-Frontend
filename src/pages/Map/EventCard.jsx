import { ShareIcon } from 'lucide-react';
import GroupList from './GroupList';

const EventCard = ({ event }) => {
  const { name, images, dates, place, description, url } = event;

  const image = images[0]?.url;

  const date = dates?.start?.dateTime
    ? new Date(dates.start.dateTime).toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
    : 'Date not available';

  const location = [
    place?.address?.line1,
    place?.city?.name,
    place?.country?.name,
  ]
    .filter(Boolean)
    .join(', ');

  const msg = {
    title: `🎉 ${name}${location ? ' @ ' + location : ''}`,
    text: `Don't miss out!${
      description ? '\n\n' + description : ''
    }\n\n📅 ${date}${
      location ? '\n📍 ' + location : ''
    }\n\nGet your tickets here:\n${url}`,
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share(msg);
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className='bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full transition hover:shadow-lg relative'>
      <img src={image} alt={name} className='w-full h-48 object-cover' />
      <div className='flex flex-col justify-between p-4 h-full'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>{name}</h3>
          <p className='text-gray-600 text-sm'>{date}</p>
          <p className='text-gray-500 text-sm'>{location}</p>
          {description && (
            <p className='mt-2 text-gray-700 text-sm line-clamp-3'>
              {description}
            </p>
          )}
        </div>
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-4 inline-block text-blue-600 hover:underline font-medium'
        >
          View on Ticketmaster →
        </a>
      </div>
      <button
        onClick={handleShare}
        className='absolute bottom-18 right-3  text-blue-600 px-4 py-2 rounded-lg border-none transition'
      >
        <ShareIcon />
      </button>

      <GroupList event={event} msg={msg} />
    </div>
  );
};

export default EventCard;
