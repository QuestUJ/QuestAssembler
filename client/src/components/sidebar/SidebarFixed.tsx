import { SidebarContentDashboard } from './SidebarContentDashboard';
import { SidebarContentRoom } from './SidebarContentRoom';

export function SidebarFixed({ isOnDashboard }: { isOnDashboard: boolean }) {
  return (
    <div className='sticky left-0 top-0 h-screen overflow-y-auto bg-background'>
      {isOnDashboard ? <SidebarContentDashboard /> : <SidebarContentRoom />}
    </div>
  );
}
