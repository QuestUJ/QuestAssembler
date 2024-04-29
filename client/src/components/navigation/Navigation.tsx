import { useWindowSize } from '@/hooks/windowSize';

import LogoWithText from '../LogoWithText';
import { SidebarDrawer } from '../sidebar/SidebarDrawer';
import { SidebarFixed } from '../sidebar/SidebarFixed';
import { User } from '../User';
import { useRoomStore } from '@/lib/roomStore';
import { Swords } from 'lucide-react';

export function Navigation() {
  const { width } = useWindowSize();
  const currentRoomName = useRoomStore((state) => state.roomName);
  return (
    <>
      {width >= 1024 ? (
        <SidebarFixed />
      ) : (
        <div>
          <div className='fixed left-20 top-5'>
            <LogoWithText />
          </div>
          <SidebarDrawer />
        </div>
      )}
      <div className='lg:w-3/5 fixed right-0 top-5 flex justify-between items-center'>
        {currentRoomName && width >= 1024 ?
        <div className='flex flex-nowrap items-center'>
          <Swords className='text-primary mr-2'/>
          <h1 className='text-primary text-3xl'>{currentRoomName}</h1>
        </div>
        : <></>}
        <User />
      </div>
    </>
  );
}
