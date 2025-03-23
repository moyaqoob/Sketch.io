import { useState, useEffect, useRef } from 'react';
import { Users, ChevronDown } from 'lucide-react';

interface RoomParticipantProps {
  participants: string[];
  noOfParticipants: number;
}

export default function RoomParticipants({
  participants,
  noOfParticipants,
}: RoomParticipantProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className='flex items-center gap-1 rounded-md px-2 py-1 whitespace-nowrap hover:bg-gray-100'
      >
        <Users className='h-4 w-4 text-gray-400' />
        {noOfParticipants}
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className='border-primary-chubb absolute left-0 z-10 mt-2 w-40 rounded-md border bg-white shadow-lg'>
          {participants.length > 0 ? (
            participants.map((participant, index) => (
              <div
                key={index}
                className='cursor-pointer rounded-md px-3 py-2 hover:bg-blue-50'
              >
                {participant}
              </div>
            ))
          ) : (
            <div className='px-3 py-2 text-gray-500'>No Participants</div>
          )}
        </div>
      )}
    </div>
  );
}
