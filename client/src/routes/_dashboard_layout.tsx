import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useWindowSize } from '@/hooks/windowSize';
import { SidebarFixed } from '@/components/sidebar/SidebarFixed';
import { SidebarDrawer } from '@/components/sidebar/SidebarDrawer';
import LogoWithText from '@/components/LogoWithText';
import { User } from '@/components/User';

function TopBarExpanded() {
  return (
    <div className='flex h-full w-full flex-row items-center justify-end'>
      <User />
    </div>
  );
}

function TopBar() {
  return (
    <div className='flex h-full flex-row flex-nowrap items-center justify-between'>
      <SidebarDrawer isOnDashboard={true} />
      <LogoWithText />
      <User />
    </div>
  );
}
function DashboardLayout() {
  const { width } = useWindowSize();
  return (
    <>
      {width >= 1024 ? (
        <div className='grid h-screen w-screen grid-cols-5 grid-rows-8 bg-gradient-to-b from-[#222] to-[#111]'>
          <div className='row-span-8'>
            <SidebarFixed isOnDashboard={true} />
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

export const Route = createFileRoute('/_dashboard_layout')({
  component: withAuthenticationRequired(DashboardLayout)
});
