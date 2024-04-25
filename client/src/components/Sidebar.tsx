import { Separator } from '@radix-ui/react-separator';
import { useState } from 'react';
import { Drawer } from 'vaul';

import { CreateGameDialog, JoinGameDialog } from '@/routes/dashboard';

import LogoWithText from './LogoWithText';
import { QuasmCollapsible } from './QuasmCollapsible';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // Sidebar is open by default

  return (
    <div className='flex h-full w-4/5 flex-col justify-end [&>button]:m-1'>
      <div className='flex w-full flex-col items-center justify-center'>
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Trigger asChild>
            <button onClick={() => setIsOpen(!isOpen)}></button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className='inset-0 bg-black/40' />
            <Drawer.Content className='fixed bottom-0 left-0 mt-24 flex h-full w-1/5'>
              <div className='bg-blue flex flex-1 flex-col justify-between p-4'>
                <div>
                  <LogoWithText />
                  <QuasmCollapsible />
                  <QuasmCollapsible />
                </div>
                <div>
                  <JoinGameDialog />
                  <CreateGameDialog />
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
        <Separator className='w-4/5' />
      </div>
    </div>
  );
}
