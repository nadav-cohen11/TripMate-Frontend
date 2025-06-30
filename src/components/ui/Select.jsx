import * as React from 'react';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { Button } from './button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';

export default function Select({
  options = [],
  value = [],
  onChange,
  name,
  placeholder = 'Select...',
  disabled = false,
  isMulti = false,
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (option) => {
    if (disabled) return;
    if (isMulti) {
      if (value.includes(option.value)) {
        onChange(value.filter((v) => v !== option.value));
      } else {
        onChange([...value, option.value]);
      }
    } else {
      onChange([option.value]);
      setOpen(false);
    }
  };

  const display = () => {
    if (!value.length) return placeholder;
    const selectedLabels = options.filter(opt => value.includes(opt.value)).map(opt => opt.label);
    return selectedLabels.join(', ');
  };

  return (
    <div className='flex flex-col gap-3'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={`justify-between font-normal ${disabled ? 'bg-gray-200' : ''}`}
            disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            type='button'
          >
            {display()}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto overflow-hidden p-0 min-w-[180px] max-h-60 overflow-y-auto'
          align='start'
          style={{ display: disabled ? 'none' : undefined }}
        >
          <div className='flex flex-col'>
            {options.map(option => (
              <button
                key={option.value}
                type='button'
                className={`flex items-center gap-2 px-4 py-2 text-left hover:bg-blue-50 ${value.includes(option.value) ? 'bg-blue-100 font-semibold' : ''}`}
                onClick={() => handleSelect(option)}
                disabled={disabled}
              >
                {isMulti && value.includes(option.value) && <CheckIcon className='w-4 h-4 text-blue-600' />}
                {option.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 