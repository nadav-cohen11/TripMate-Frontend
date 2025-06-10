import { Button } from '@/components/ui/button';
import useChatSocket from '@/hooks/useChatSocket';
import { SendIcon } from 'lucide-react';

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Group = ({ group, event ,msg }) => {
  
  const navigate = useNavigate();

  const sendEvent = async () => {
    navigate('/chat', { state: { group, msg } });
  };

  return (
    <div className='flex items-baseline gap-3 p-3 rounded-lg hover:bg-gray-100 transition justify-start'>
      <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600'>
        {group.chatName
          ? group.chatName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
          : ''}
      </div>
      <div>
        <p className='font-medium text-gray-900'>{group.chatName}</p>
      </div>
      <Button variant='ghost' size='icon' onClick={sendEvent}>
        <SendIcon />
      </Button>
    </div>
  );
};

export default Group;
