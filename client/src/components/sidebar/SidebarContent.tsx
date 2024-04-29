import { CreateGameDialog } from '../dialogs/CreateGameDialog';
import { JoinGameDialog } from '../dialogs/JoinGameDialog';
import LogoWithText from '../LogoWithText';
import { QuasmCollapsible } from '../QuasmCollapsible';
import { Separator } from '../ui/separator';

export function SidebarContent() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-between bg-background p-4'>
      <div>
        <LogoWithText />
        <QuasmCollapsible />
        <QuasmCollapsible />
      </div>
      <div className='flex w-full flex-col items-center'>
        <Separator className='w-full' />
        <JoinGameDialog />
        <CreateGameDialog />
      </div>
    </div>
  );
}
