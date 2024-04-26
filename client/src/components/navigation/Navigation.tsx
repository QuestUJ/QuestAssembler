import { useWindowSize } from '@/hooks/windowSize';

import LogoWithText from '../LogoWithText';
import { SidebarDrawer } from '../sidebar/SidebarDrawer';
import { SidebarFixed } from '../sidebar/SidebarFixed';
import { User } from '../User';

export function Navigation() {
  const { width } = useWindowSize();

  return (
    <>
      {width >= 1024 ? (
        <SidebarFixed />
      ) : (
        <>
          <div className='fixed left-20'>
            <LogoWithText />
          </div>
          <SidebarDrawer />
        </>
      )}
      <div className='fixed right-0 top-5 flex items-center'>
        <User />
      </div>
    </>
  );
}
