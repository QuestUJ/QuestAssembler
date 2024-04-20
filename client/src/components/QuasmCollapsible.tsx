import './QuasmCollapsible.css';

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
    <ScrollArea.Root className='ScrollAreaRoot'>
      <ScrollArea.Viewport className='ScrollAreaViewport'>
        <div style={{ padding: '15px 20px' }}>
          <div className='Text'>Tags</div>
          {TAGS.map(tag => (
            <Button className='Tag' key={tag}>
              {tag}
            </Button>
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className='ScrollAreaScrollbar'
        orientation='vertical'
      >
        <ScrollArea.Thumb className='ScrollAreaThumb' />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        className='ScrollAreaScrollbar'
        orientation='horizontal'
      >
        <ScrollArea.Thumb className='ScrollAreaThumb' />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className='ScrollAreaCorner' />
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
