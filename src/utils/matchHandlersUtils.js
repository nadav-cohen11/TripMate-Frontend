import { createOrAcceptMatch, unmatchUsers } from '../api/matchApi';
export const handleCardSwipe = async (direction, userId) => {
  try {
    if (direction === 'right') {
      await createOrAcceptMatch({
        user2Id: userId,
        scores: { compatibility: Math.floor(Math.random() * 100) },
      });
    } else if (direction === 'left') {
      await unmatchUsers({ user2Id: userId });
    }
  } catch (err) {
    console.error(`Swipe ${direction} failed for user ${userId}:`, err);
  }
};
