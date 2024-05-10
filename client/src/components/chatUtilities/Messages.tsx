import type { MessageDetails, StoryChunkDetails } from '@quasm/common';
import {
  Accordion,
  AccordionContent,
  AccordionItem
} from '@radix-ui/react-accordion';
import { ReactNode } from 'react';

import { AccordionTrigger } from '../ui/accordion';

export function Message({ message }: { message: MessageDetails }) {
  const { authorName, characterPictureURL, content, timestamp } = message;
  return (
    <div className='m-1 my-3 flex min-h-10 w-full'>
      <img
        src={characterPictureURL}
        className='aspect-square h-full max-h-10 rounded-full'
      />
      <div className='mx-2 w-full'>
        <div className='flex flex-nowrap items-center'>
          <h1 className='text-md mr-2 text-primary'>{authorName}</h1>
          <h3 className='pt-1 text-xs text-secondary'>
            {timestamp.toLocaleString()}
          </h3>
        </div>
        <p className='text-xs'>{content}</p>
      </div>
    </div>
  );
}

export function StoryChunk({ storyChunk }: { storyChunk: StoryChunkDetails }) {
  const { contents, imageURL } = storyChunk;
  return (
    <div className='m-1 my-3 flex min-h-10 flex-col'>
      <p className='text-sm'>{contents}</p>
      {imageURL ? (
        <img className='m-1 aspect-square w-40' src={imageURL} />
      ) : (
        <></>
      )}
    </div>
  );
}

export function StoryChunkContainer({ story }: { story: StoryChunkDetails[] }) {
  return (
    <div className='flex flex-col'>
      {story.map(storyChunk => (
        <StoryChunk storyChunk={storyChunk} />
      ))}
    </div>
  );
}

export function MessageContainer({ messages }: { messages: MessageDetails[] }) {
  return (
    <div className='flex flex-col'>
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
        <AccordionTrigger className='text-2xl text-primary'>
          Chat
        </AccordionTrigger>
      </AccordionItem>
    </Accordion>
  );
}
// Outlet wrapper is used to display children correctly (not overflow the site)
export function OutletWrapper({ children }: { children: ReactNode }) {
  return (
    <div className='h-full overflow-y-auto p-3'>
      <div className='flex h-fit min-h-full flex-col'>{children}</div>
    </div>
  );
}
