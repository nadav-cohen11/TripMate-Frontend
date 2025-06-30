import { Loader2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ButtonLoading({style}) {
  return (
    <Button size='sm' disabled className={style}>
      <Loader2Icon className='animate-spin' />
      Please wait
    </Button>
  );
}
