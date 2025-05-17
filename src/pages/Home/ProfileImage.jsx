import { AnimatePresence, motion } from 'framer-motion';

const ProfileImage = ({ photo, photoIndex }) => {
  return (
    <div className="relative w-full h-[60%]">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={photoIndex}
          src={photo}
          alt={`profile-${photoIndex}`}
          className="object-cover w-full h-full rounded-t-lg"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </AnimatePresence>
    </div>
  );
};

export default ProfileImage;