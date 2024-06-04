import { ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  displayNickname,
  NicknameDisplayStyle
} from '@/lib/misc/displayNickname';
import { useWindowSize } from '@/lib/misc/windowSize';

import { SvgSpinner } from '../Spinner';
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

interface MessagesProps {
  messages: MessageDetails[][];
  fetchMore: () => void;
  hasMore: boolean;
  loader: ReactNode;
  containerID: string;
}

export function MessageContainer({
  messages,
  fetchMore,
  hasMore,
  loader,
  containerID
}: MessagesProps) {
  return (
    <div
      id={containerID}
      className='flex h-full w-full flex-col-reverse overflow-y-auto'
    >
      <InfiniteScroll
        className='flex flex-col-reverse gap-2 p-4 pb-0'
        inverse={true}
        dataLength={messages.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={loader}
        scrollableTarget={containerID}
      >
        {messages.length <= 0 && (
          <p className='text-secondary'>No messages yet</p>
        )}
        {messages.map(page =>
          page.map(msg => (
            <span key={msg.timestamp.toISOString()}>
              <Message message={msg} />
            </span>
          ))
        )}
        {!hasMore && <p className='m-4 text-secondary'>No more messages</p>}{' '}
      </InfiniteScroll>
    </div>
  );
}

interface BroadcastProps {
  messages: MessageDetails[][];
  fetchMore: () => void;
  hasMore: boolean;
}

export function BroadcastChat({
  messages,
  fetchMore,
  hasMore
}: BroadcastProps) {
  return (
    <Accordion className='h-full' type='single' collapsible>
      <AccordionItem className='flex h-full flex-col' value='chat'>
        <AccordionContent className='h-full'>
          <MessageContainer
            messages={messages}
            fetchMore={fetchMore}
            loader={<SvgSpinner className='h-20 w-20' />}
            hasMore={hasMore}
            containerID='broadcast-scroller'
          />
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
