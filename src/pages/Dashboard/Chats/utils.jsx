export const formatDateHeader = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const groupMessagesByDate = (messages = []) => {
  return messages.reduce((acc, msg) => {
    const dateKey = msg.sentAt
      ? new Date(msg.sentAt).toDateString()
      : 'Unknown';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});
};





export const leaveIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-5 w-5 mr-2'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1'
    />
  </svg>
);

export const blockIcon = 
 <svg
    className='inline-block w-4 h-4 mr-1'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    viewBox='0 0 24 24'
  >
    <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' />
    <line x1='5' y1='5' x2='19' y2='19' stroke='currentColor' strokeWidth='2' />
  </svg>

export const backIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-5 w-5 mr-2'
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path
      fillRule='evenodd'
      d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
      clipRule='evenodd'
    />
  </svg>
);