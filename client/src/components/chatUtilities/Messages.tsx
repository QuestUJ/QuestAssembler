import {
  Accordion,
  AccordionContent,
  AccordionItem
} from '@radix-ui/react-accordion';
import { ReactNode } from 'react';

import type { MessageDetails, StoryChunkDetails } from '@/lib/sharedTypes';

import { AccordionTrigger } from '../ui/accordion';

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

export function StoryChunk({ storyChunk }: { storyChunk: StoryChunkDetails }) {
  const { content, imageURL } = storyChunk;
  return (
    <div className='flex min-h-10 flex-col gap-4'>
      <p className='text-md rounded-md bg-background p-4'>{content}</p>
      {imageURL && (
        <img
          className='aspect-square max-h-96 max-w-96 self-center rounded-md'
          src={imageURL}
        />
      )}
    </div>
  );
}

export function StoryChunkContainer({ story }: { story: StoryChunkDetails[] }) {
  return (
    <div className='flex flex-col gap-4'>
      {story.map(storyChunk => (
        <StoryChunk storyChunk={storyChunk} />
      ))}
      <hr className='border-primary' />
    </div>
  );
}

export function MessageContainer({ messages }: { messages: MessageDetails[] }) {
  return (
    <div className='flex flex-col gap-2'>
      {messages.map(message => (
        <Message key={message.timestamp.toISOString()} message={message} />
      ))}
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
