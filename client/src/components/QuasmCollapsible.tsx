import * as ScrollArea from '@radix-ui/react-scroll-area';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

const TAGS = Array.from({ length: 15 }).map(
  (_, i, a) => `thing_${a.length - i}`
);

export function ScrollableContent() {
  return (
    <ScrollArea.Root className='h-[225px] w-[200px] overflow-hidden rounded bg-white shadow-lg'>
      <ScrollArea.Viewport className='h-full w-full rounded'>
        <div className='p-5'>
          <div className='text-sm font-medium text-violet-600'>Tags</div>
          {TAGS.map(tag => (
            <Button
              className='border-mauve-200 text-mauve-800 mt-2 border-t pt-2 text-xs'
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
  return (
    <div className='space-y-4'>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button>QuasmCollapsible</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollableContent />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
