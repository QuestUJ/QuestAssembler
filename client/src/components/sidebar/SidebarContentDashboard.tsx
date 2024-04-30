import { CreateGameDialog } from '../dialogs/CreateGameDialog';
import { JoinGameDialog } from '../dialogs/JoinGameDialog';
import LogoWithText from '../LogoWithText';
import { Separator } from '../ui/separator';

export function SidebarContentDashboard() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-between bg-background p-4'>
      <div className='flex flex-row justify-center'>
        <LogoWithText />
      </div>
      <div className='flex w-full flex-col items-center'>
        <Separator className='w-full' />
        <JoinGameDialog />
        <CreateGameDialog />
      </div>
    </div>
  );
}
