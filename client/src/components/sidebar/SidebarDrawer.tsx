import hamburgerIcon from '@/assets/hamburger.svg';

import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger
} from '../ui/drawer';
import { SidebarContent } from './SidebarContent';

export function SidebarDrawer() {
  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <div className='fixed left-5 top-5 h-10'>
          <button>
            <img src={hamburgerIcon} alt='Open nav' />
          </button>
        </div>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent className='h-screen w-96'>
          <SidebarContent />
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
