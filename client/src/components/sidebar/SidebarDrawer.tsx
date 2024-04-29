import hamburgerIcon from '@/assets/hamburger.svg';

import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger
} from '../ui/drawer';
import { SidebarContentDashboard } from './SidebarContentDashboard';
import { SidebarContentRoom } from './SidebarContentRoom';

export function SidebarDrawer({ isOnDashboard }: { isOnDashboard: boolean }) {
  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <div className='h-10'>
          <button>
            <img src={hamburgerIcon} alt='Open nav' />
          </button>
        </div>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent className='h-screen w-72 overflow-y-auto'>
          {isOnDashboard ? <SidebarContentDashboard /> : <SidebarContentRoom />}
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
