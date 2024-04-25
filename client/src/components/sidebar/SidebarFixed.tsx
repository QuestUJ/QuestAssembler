import { SidebarContent } from './SidebarContent';

export function SidebarFixed() {
  return (
    <div className='sticky left-0 top-0 h-screen w-96'>
      <SidebarContent />
    </div>
  );
}
