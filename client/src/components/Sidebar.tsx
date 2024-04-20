import { Drawer } from 'vaul';

import { QuasmCollapsible } from './QuasmCollapsible';
import { Button } from './ui/button';

export function Sidebar() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button>Open Drawer</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 bg-black/40' />
        <Drawer.Content className='fixed bottom-0 left-0 mt-24 flex h-full w-[400px]'>
          <div className='flex-1 bg-white p-4'>
            <img src={'assets/logo.png'} />
            {/* */}
            <QuasmCollapsible />
            <QuasmCollapsible />
            <Button>User</Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
