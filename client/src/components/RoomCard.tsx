import { ApiRoomPayload } from '@quasm/common';
import { Link } from '@tanstack/react-router';
import { Crown, Swords } from 'lucide-react';
import shortUUID from 'short-uuid';

import {
  displayNickname,
  NicknameDisplayStyle
} from '@/lib/misc/displayNickname';

export function RoomCard({ room }: { room: ApiRoomPayload }) {
  return (
    <Link
      to='/room/$roomId'
      params={{
        roomId: shortUUID().fromUUID(room.id)
      }}
    >
      <div className='mx-4 my-2 grid h-40 w-[350px] grid-cols-7 grid-rows-3 rounded-xl border-2 bg-card transition-colors hover:border-primary md:w-[450px] md:grid-cols-10 md:gap-0 lg:h-48 lg:w-[600px]'>
        <div className='col-span-1 row-span-1 border-b-2 border-r-2 border-zinc-800 p-1'>
          {room.isCurrentUserGameMaster ? (
            <Crown className='h-full w-full p-1 text-primary lg:p-2' />
          ) : (
            <Swords className='h-full w-full p-1 text-primary lg:p-2' />
          )}
        </div>
        <div className='col-span-5 row-span-1 border-b-2 border-zinc-800 px-2 py-1'>
          <h1 className='overflow-hidden whitespace-nowrap text-xl lg:text-3xl'>
            {room.roomName}
          </h1>
          <h4 className='text-xs lg:text-sm'>
            <span className='text-secondary'>Game Master:</span>{' '}
            {displayNickname(room.gameMasterName, NicknameDisplayStyle.SHORT)}
          </h4>
        </div>
        <div className='col-span-1 row-span-1 flex flex-col items-center justify-center border-b-2 border-l-2 border-zinc-800 p-1'>
          <h1 className='text-sm'>
            {room.currentPlayers} / {room.maxPlayers}
          </h1>
          <h3 className='text-xs'>Players</h3>
        </div>
        <div className='col-span-3 row-span-3 hidden items-center justify-center rounded-r-xl border-l-2 bg-zinc-950 md:flex'>
          {room.lastImageUrl ? (
            <img
              className='h-full w-full rounded-r-xl'
              src={room.lastImageUrl}
              alt='last image from room'
            />
          ) : (
            <h1 className='text-center'>Image unavailable</h1>
          )}
        </div>
        <div className='relative col-span-7 row-span-2 row-start-2 overflow-hidden p-4'>
          {room.lastMessages ? (
            <div className='h-full w-full'>
              {room.lastMessages.map(message => (
                <h3 key={message}>{message}</h3>
              ))}
            </div>
          ) : (
            <h1>Last messages unavailable</h1>
          )}
          <span className='absolute bottom-0 left-0 h-6 w-full rounded-xl bg-gradient-to-b from-transparent to-card'></span>
        </div>
      </div>
    </Link>
  );
}
