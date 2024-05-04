import { RoomPayload } from '@quasm/common';
import { Link } from '@tanstack/react-router';
import { Crown, Swords } from 'lucide-react';

export function RoomCard({ room }: { room: RoomPayload }) {
  return (
    <Link
      to='/room/$roomId'
      params={{
        roomId: room.id
      }}
    >
      <div className='my-2 grid h-40 w-[450px] grid-cols-10 grid-rows-3 gap-0 rounded-xl border-2 bg-card transition-colors hover:border-primary lg:h-48 lg:w-[600px] [&>div]:border-zinc-800 [&>div]:p-1'>
        <div className='col-span-1 row-span-1 border-r-2'>
          {room.isCurrentUserGameMaster ? (
            <Crown className='h-full w-full p-1 text-primary lg:p-2' />
          ) : (
            <Swords className='h-full w-full p-1 text-primary lg:p-2' />
          )}
        </div>
        <div className='col-span-5 row-span-1 p-1'>
          <h1 className='text-xl lg:text-3xl'>{room.roomName}</h1>
          <h4 className='text-xs lg:text-sm'>
            <span className='text-secondary'>Game Master:</span>{' '}
            {room.gameMasterName}
          </h4>
        </div>
        <div className='col-span-1 row-span-1 flex flex-col items-center justify-center border-l-2 p-1'>
          <h1 className='text-sm'>
            {room.currentPlayers} / {room.maxPlayers}
          </h1>
          <h3 className='text-xs'>Players</h3>
        </div>
        <div className='col-span-3 row-span-3 flex items-center justify-center rounded-r-xl border-l-2 bg-zinc-950'>
          {room.lastImageUrl ? (
            <img src={room.lastImageUrl} alt='last image from room' />
          ) : (
            <h1 className='text-center'>Image unavailable</h1>
          )}
        </div>
        <div className='col-span-7 row-span-2 row-start-2 flex items-center justify-center border-t-2'>
          {room.lastMessages ? (
            <div>
              {room.lastMessages.map(message => (
                <h3>{message}</h3>
              ))}
            </div>
          ) : (
            <h1>Last messages unavailable</h1>
          )}
        </div>
      </div>
    </Link>
  );
}
