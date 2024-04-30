import * as ScrollArea from '@radix-ui/react-scroll-area';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

export function ScrollableContent({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea.Root className='h-[350px] w-full rounded bg-background shadow-lg'>
      <ScrollArea.Viewport className='h-full w-full rounded'>
        <div className='p-5'>
          <div className='text-sm font-medium'></div>
          {children}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className='flex touch-none select-none bg-black/60 p-0.5 transition duration-150 ease-out'
        orientation='vertical'
      >
        <ScrollArea.Thumb className='bg-mauve-300 relative flex-1 rounded' />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        className='flex touch-none select-none flex-col bg-black/60 p-0.5 transition duration-150 ease-out'
        orientation='horizontal'
      >
        <ScrollArea.Thumb className='bg-mauve-300 relative flex-1 rounded' />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className='bg-black/75' />
    </ScrollArea.Root>
  );
}

export function QuasmCollapsible({
  text,
  children
}: {
  text: string;
  children: React.ReactNode;
}) {
  const [isExpanded] = useState(false);

  return (
    <div className='space-y-4'>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <h1 className='text-3xl text-primary'>{text}</h1>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={`collapsible-content ${isExpanded ? 'expanded' : 'collapsed'}`}
        >
          <ScrollableContent>{children}</ScrollableContent>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
