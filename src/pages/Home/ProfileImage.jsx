import { AnimatePresence, motion } from 'framer-motion';

const ProfileImage = ({ photo, photoIndex }) => {
  return (
    <div className="relative w-full h-[60%] flex items-center justify-center">
      <div className="w-[95%] h-[95%] rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white/40">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={photoIndex}
            src={photo}
            alt={`profile-${photoIndex}`}
            className="object-cover w-full h-full rounded-2xl"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileImage;
