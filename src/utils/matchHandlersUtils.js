import { createOrAcceptMatch, unmatchUsers } from '../api/matchApi';
export const handleCardSwipe = async (direction, userId) => {
  try {
    if (direction === 'right') {
      await createOrAcceptMatch({
        user2Id: userId
      });
    } else if (direction === 'left') {
      await unmatchUsers({ user2Id: userId });
    }
  } catch (err) {
    toast.error(extractBackendError(err));
  }
};


