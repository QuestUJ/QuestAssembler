import { withAuthenticationRequired } from '@auth0/auth0-react';
import { createFileRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { Swords } from 'lucide-react';

import LogoWithText from '@/components/LogoWithText';
import { SidebarDrawer } from '@/components/sidebar/SidebarDrawer';
import { SidebarFixed } from '@/components/sidebar/SidebarFixed';
import { User } from '@/components/User';
import { useWindowSize } from '@/hooks/windowSize';
import { getIsOnDashboard, useQuasmStore } from '@/lib/quasmStore';
import { cn } from '@/lib/utils';

function TopBarExpanded() {
  const currentRoomName = useQuasmStore(state => state.roomName);
  const isOnDashboard = useQuasmStore(getIsOnDashboard);
  return (
    <div
      className={cn(
        'flex h-full w-full flex-row items-center p-1 pl-4',
        isOnDashboard ? 'justify-end' : 'justify-between'
      )}
    >
      {!isOnDashboard && (
        <div className='flex flex-row items-center'>
          <Swords className='mr-1 text-primary' />
          <h1 className='text-4xl text-primary'>{currentRoomName}</h1>
        </div>
      )}
      <User />
    </div>
  );
}

function TopBar() {
  const isOnDashboard = useQuasmStore(getIsOnDashboard);

  return (
    <div className='flex h-full flex-row flex-nowrap items-center justify-between bg-background'>
      <SidebarDrawer isOnDashboard={isOnDashboard} />
      <LogoWithText />
      <User />
    </div>
  );
}

function RoomLayout() {
  const isOnDashboard = useQuasmStore(getIsOnDashboard);
  const { width } = useWindowSize();
  return (
    <>
      {width >= 1024 ? (
        <div className='grid h-screen w-screen grid-cols-5 grid-rows-[5em_repeat(7,1fr)] overflow-x-auto bg-gradient-to-b from-[#222] to-[#111]'>
          <div className='row-span-8'>
            <SidebarFixed isOnDashboard={isOnDashboard} />
          </div>
          <div className='col-span-4'>
            <TopBarExpanded />
          </div>
          <div className='col-span-4 col-start-2 row-span-7 row-start-2'>
            <Outlet />
          </div>
        </div>
      ) : (
        <div className='grid h-screen w-screen grid-cols-1 grid-rows-8'>
          <div>
            <TopBar />
          </div>
          <div className='row-span-7 bg-gradient-to-b from-[#222] to-[#111]'>
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}

export const Route = createFileRoute('/_auth')({
  component: withAuthenticationRequired(RoomLayout)
});
