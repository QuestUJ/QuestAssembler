import { ReactNode, useRef } from 'react';

import {
  displayNickname,
  NicknameDisplayStyle
} from '@/lib/misc/displayNickname';
import { useWindowSize } from '@/lib/misc/windowSize';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';

interface MessageDetails {
  authorName: string;
  characterPictureURL: string | undefined;
  timestamp: Date;
  content: string;
}

export function Message({ message }: { message: MessageDetails }) {
  const { authorName, characterPictureURL, content, timestamp } = message;
  const { width } = useWindowSize();
  return (
    <div className='flex min-h-10 gap-2'>
      <img
        src={characterPictureURL}
        className='aspect-square h-10 w-10 self-end rounded-full'
      />
      <div className='flex flex-col gap-1 rounded-md bg-background p-2'>
        <div className='flex flex-nowrap justify-between gap-4'>
          <h1 className='text-sm font-semibold text-primary'>
            {displayNickname(authorName, NicknameDisplayStyle.LONG, width)}
          </h1>
          <h3 className='text-xs text-secondary'>
            {timestamp.toLocaleString()}
          </h3>
        </div>
        <hr />
        <p className='text-md whitespace-pre'>{content}</p>
      </div>
    </div>
  );
}

export function MessageContainer({ messages }: { messages: MessageDetails[] }) {
  return (
    <div className='flex flex-col gap-2' data-testid='messages'>
      {messages.length <= 0 && (
        <p className='text-secondary'>No messages yet</p>
      )}
      {messages.map(message => (
        <Message key={message.timestamp.toISOString()} message={message} />
      ))}
    </div>
  );
}

function useScrolledToTop(onReachTop: () => void) {
  const startRef = useRef<HTMLElement>(null);

  const onScroll = (e: React.UIEvent<HTMLElement>) => {
    const container = e.target as HTMLElement;

    const { top: topLimit } = container.getBoundingClientRect();

    if (!startRef.current) {
      return;
    }

    const startPos = startRef.current.getBoundingClientRect().top;

    if (startPos >= topLimit) {
      onReachTop();
    }
  };

  return {
    onScroll,
    startRef
  };
}

interface BroadcastProps {
  messages: MessageDetails[];
  onReachTop: () => void;
}

export function BroadcastChat({ messages, onReachTop }: BroadcastProps) {
  const { startRef, onScroll } = useScrolledToTop(onReachTop);

  return (
    <Accordion className='h-full' type='single' collapsible>
      <AccordionItem className='flex h-full flex-col' value='chat'>
        <AccordionContent
          onScroll={onScroll}
          className='h-full overflow-y-auto'
        >
          <span ref={startRef}></span>
          <MessageContainer messages={messages} />
        </AccordionContent>
        <div className='mt-4 flex w-full items-center'>
          <hr className='flex-grow border-primary' />
          <AccordionTrigger className='rounded-md bg-primary p-2 font-decorative text-sm font-bold text-primary-foreground'>
            Chat
          </AccordionTrigger>
          <hr className='flex-grow border-primary' />
        </div>
      </AccordionItem>
    </Accordion>
  );
}
// Outlet wrapper is used to display children correctly (not overflow the site)
export function OutletWrapper({ children }: { children: ReactNode }) {
  return (
    <div className='h-full overflow-y-auto p-4 pb-0'>
      <div className='flex h-fit min-h-full flex-col justify-end gap-4'>
        {children}
      </div>
    </div>
  );
}
