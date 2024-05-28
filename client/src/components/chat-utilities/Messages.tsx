import {
  Accordion,
  AccordionContent,
  AccordionItem
} from '@radix-ui/react-accordion';
import { ReactNode, useEffect, useRef } from 'react';

import { AccordionTrigger } from '../ui/accordion';

interface MessageDetails {
  authorName: string;
  characterPictureURL: string | undefined;
  timestamp: Date;
  content: string;
}

export function Message({ message }: { message: MessageDetails }) {
  const { authorName, characterPictureURL, content, timestamp } = message;
  return (
    <div className='flex min-h-10 gap-2'>
      <img
        src={characterPictureURL}
        className='aspect-square h-10 w-10 self-end rounded-full'
      />
      <div className='flex flex-col gap-1 rounded-md bg-background p-2'>
        <div className='flex flex-nowrap justify-between gap-4'>
          <h1 className='text-sm font-semibold text-primary'>{authorName}</h1>
          <h3 className='text-xs text-secondary'>
            {timestamp.toLocaleString()}
          </h3>
        </div>
        <hr />
        <p className='text-md'>{content}</p>
      </div>
    </div>
  );
}

export function MessageContainer({ messages }: { messages: MessageDetails[] }) {
  const scrollToRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    scrollToRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [scrollToRef, messages]);

  return (
    <div className='flex flex-col gap-2'>
      {messages.length <= 0 && (
        <p className='text-secondary'>No messages yet</p>
      )}
      {messages.map(message => (
        <Message key={message.timestamp.toISOString()} message={message} />
      ))}
      <span ref={scrollToRef}></span>
    </div>
  );
}

export function BroadcastChat({ messages }: { messages: MessageDetails[] }) {
  return (
    <Accordion type='single' collapsible>
      <AccordionItem value='chat'>
        <AccordionContent>
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
