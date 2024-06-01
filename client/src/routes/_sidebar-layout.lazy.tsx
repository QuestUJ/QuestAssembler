import { withAuthenticationRequired } from '@auth0/auth0-react';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { Crown, Swords } from 'lucide-react';

import LogoWithText from '@/components/LogoWithText';
import { SidebarDrawer } from '@/components/sidebar/SidebarDrawer';
import { SidebarFixed } from '@/components/sidebar/SidebarFixed';
import { SvgSpinner } from '@/components/Spinner';
import { User } from '@/components/User';
import { useWindowSize } from '@/lib/misc/windowSize';
import { useQuasmStore } from '@/lib/stores/quasmStore';
import { cn } from '@/lib/utils';

function RoomIcon({ isGameMaster }: { isGameMaster: boolean }) {
  return isGameMaster ? (
    <Crown className='mr-4 h-10 w-10 flex-shrink-0 text-primary' />
  ) : (
    <Swords className='mr-4 h-10 w-10 flex-shrink-0 text-primary' />
  );
}

function TopBarExpanded() {
  const isGameMaster = useQuasmStore(state => state.isGameMaster);
  const currentRoomName = useQuasmStore(state => state.roomName);

  const { roomId }: { roomId: string | undefined } = useParams({
    strict: false
  });
  const isOnDashboard = roomId === undefined;

  return (
    <div
      className={cn(
        'flex h-full w-full flex-row items-center bg-mantle p-4',
        isOnDashboard ? 'justify-end' : 'justify-between'
      )}
    >
      {!isOnDashboard && (
        <div className='mr-4 flex flex-shrink flex-row items-center overflow-hidden'>
          {!currentRoomName ? (
            <SvgSpinner className='h-10 w-10' />
          ) : (
            <>
              <RoomIcon isGameMaster={isGameMaster} />
              <h1 className='whitespace-nowrap font-decorative text-4xl text-primary'>
                {currentRoomName}
              </h1>
            </>
          )}
        </div>
      )}
      <User />
    </div>
  );
}

function TopBar() {
  const { roomId }: { roomId: string | undefined } = useParams({
    strict: false
  });

  return (
    <div className='flex h-full flex-row flex-nowrap items-center justify-between'>
      <SidebarDrawer isOnDashboard={roomId === undefined} />
      <LogoWithText />
      <User />
    </div>
  );
}

function SidebarLayout() {
  const { width } = useWindowSize();

  const { roomId }: { roomId: string | undefined } = useParams({
    strict: false
  });

  return (
    <>
      {width >= 1024 ? (
        <div className='grid h-screen w-screen grid-cols-[300px_repeat(4,_1fr)] grid-rows-[5em_repeat(7,1fr)] overflow-x-auto bg-crust from-[#222] to-[#111]'>
          <div className='row-span-8'>
            <SidebarFixed isOnDashboard={roomId === undefined} />
          </div>
          <div className='col-span-4'>
            <TopBarExpanded />
          </div>
          <div className='col-span-4 col-start-2 row-span-7 row-start-2 overflow-y-auto'>
            <Outlet />
          </div>
        </div>
      ) : (
        <div className='grid h-screen w-screen grid-cols-1 grid-rows-8'>
          <div className='p-4'>
            <TopBar />
          </div>
          <div className='row-span-7 overflow-y-auto bg-crust from-[#222] to-[#111]'>
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}

export const Route = createLazyFileRoute('/_sidebar-layout')({
  component: withAuthenticationRequired(SidebarLayout)
});
