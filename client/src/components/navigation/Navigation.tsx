import { useWindowSize } from '@/hooks/windowSize';

import LogoWithText from '../LogoWithText';
import { SidebarDrawer } from '../sidebar/SidebarDrawer';
import { SidebarFixed } from '../sidebar/SidebarFixed';

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
    </>
  );
}
