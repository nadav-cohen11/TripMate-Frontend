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
    <div className='bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-[#00BFFF]/10 overflow-hidden flex flex-col h-full transition hover:shadow-xl relative'>
      <img src={image} alt={name} className='w-full h-48 object-cover' />
      <div className='flex flex-col justify-between p-5 h-full'>
        <div>
          <h3 className='text-xl font-bold text-black mb-1'>{name}</h3>
          <span className='inline-block bg-[#eaf4fd] text-[#00BFFF] text-xs font-semibold px-3 py-1 rounded-full mb-2'>
            {date}
          </span>
          <p className='text-[#00BFFF] text-sm font-medium mb-1'>{location}</p>
          {description && (
            <p className='mt-2 text-gray-700 text-sm line-clamp-3'>
              {description}
            </p>
          )}
        </div>
        <div className='flex flex-row gap-2 mt-4'>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex-1 inline-block bg-[#00BFFF] text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-[#00BFFF] transition text-center'
          >
            View on Ticketmaster →
          </a>
          <GroupList event={event} msg={msg} />
        </div>
      </div>
      <button
        onClick={handleShare}
        className='absolute bottom-24 right-4 text-[#00BFFF] bg-white/80 p-2 rounded-full shadow border border-[#00BFFF]/20 hover:bg-[#eaf4fd] transition'
      >
        <ShareIcon />
      </button>
    </div>
  );
};

export default EventCard;
