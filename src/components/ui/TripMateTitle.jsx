import Typewriter from '@/components/animations/Typewriter';
import { useNavigate } from 'react-router-dom';

const TripMateTitle = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="absolute top-6 left-6 z-20 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => navigate('/home')}
    >
      <Typewriter
        text="TripMate"
        className="text-4xl text-black tracking-wide"
        style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}
      />
    </div>
  );
};

export default TripMateTitle; 