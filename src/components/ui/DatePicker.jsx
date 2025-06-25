'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function DatePicker({
  date,
  handleInputChange,
  name,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);
  let convertedDate;
  if(date){
     convertedDate = new Date(date)
  }
  return (
    <div className='flex flex-col gap-3'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id='date'
            className={`justify-between font-normal ${
              disabled ? 'bg-gray-200' : ''
            }`}
            disabled={disabled}
            tabIndex={disabled ? -1 : 0}
          >
            {convertedDate
              ? convertedDate?.toLocaleDateString()
              : name}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto overflow-hidden p-0'
          align='start'
          style={{ display: disabled ? 'none' : undefined }}
        >
          <Calendar
            mode='single'
            selected={convertedDate}
            captionLayout='dropdown'
            onSelect={(convertedDate) => {
              handleInputChange({ target: { name, value: convertedDate } });
              setOpen(false);
            }}
            disabled={disabled}
            withFutureYears={name == "birthDate" ? false : true}  
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
