import Typewriter from '@/components/animations/Typewriter';

const TripMateTitle = () => {
  return (
    <div className="absolute top-6 left-6 z-20">
      <Typewriter
        text="TripMate"
        className="text-4xl text-black tracking-wide"
        style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}
      />
    </div>
  );
};

export default TripMateTitle; 