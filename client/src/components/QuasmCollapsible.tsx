import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

const TAGS = Array.from({ length: 15 }).map((_, i) => `Player ${i + 1}`);

export function ScrollableContent() {
  return (
    <ScrollArea.Root className='h-[350px] w-full rounded bg-background shadow-lg'>
      <ScrollArea.Viewport className='h-full w-full rounded'>
        <div className='p-5'>
          <div className='text-sm font-medium'></div>
          {TAGS.map(tag => (
            <Button
              className='m-2 w-4/5 rounded border border-primary bg-background text-primary'
              key={tag}
            >
              {tag}
            </Button>
          ))}
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

export function QuasmCollapsible() {
  const [isExpanded] = useState(false);

  return (
    <div className='space-y-4'>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button className='m-2 w-4/5 rounded border border-primary bg-background text-primary'>
            QuasmCollapsible
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={`collapsible-content ${isExpanded ? 'expanded' : 'collapsed'}`}
        >
          <ScrollableContent />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
