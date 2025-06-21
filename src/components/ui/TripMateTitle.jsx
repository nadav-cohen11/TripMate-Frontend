import { useNavigate } from 'react-router-dom';

const TripMateTitle = () => {
  const navigate = useNavigate();

  return (
    <div
      className='absolute top-6 left-6 z-20 cursor-pointer hover:opacity-80 transition-opacity flex items-center'
      onClick={() => navigate('/home')}
    >
      <img
        src='/assets/images/logo.png'
        alt='TripMate Logo'
        className='h-14 w-auto object-contain'
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default TripMateTitle;
