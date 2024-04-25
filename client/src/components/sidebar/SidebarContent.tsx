import { CreateGameDialog, JoinGameDialog } from '@/routes/dashboard';

import LogoWithText from '../LogoWithText';
import { QuasmCollapsible } from '../QuasmCollapsible';
import { Separator } from '../ui/separator';

export function SidebarContent() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-between bg-black p-4'>
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
