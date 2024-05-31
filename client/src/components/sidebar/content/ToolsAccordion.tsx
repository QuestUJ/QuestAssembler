import { Link, useParams } from '@tanstack/react-router';
import {
  BookOpenText,
  CheckCircle,
  Crown,
  MessageSquare,
  Scroll
} from 'lucide-react';
import { ReactNode } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useQuasmStore } from '@/lib/stores/quasmStore';

function ToolLink({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-14 items-center gap-2 rounded-xl p-2 hover:bg-highlight-foreground'>
      {children}
    </div>
  );
}

interface Props {
  numOfUnreadBroadcast: number | undefined;
  numOfUnreadStory: number | undefined;
}

export function ToolsAccordion({
  numOfUnreadBroadcast,
  numOfUnreadStory
}: Props) {
  const isGameMaster = useQuasmStore(state => state.isGameMaster);
  const { roomId }: { roomId: string } = useParams({ strict: false });

  const displayStoryUnread =
    numOfUnreadStory !== undefined && numOfUnreadStory > 0;
  const displayBroadcastUnread =
    numOfUnreadBroadcast !== undefined && numOfUnreadBroadcast > 0;

  return (
    <AccordionItem value='tools'>
      <AccordionTrigger className='w-full font-decorative text-2xl text-primary hover:text-primary-shaded'>
        Tools
      </AccordionTrigger>
      <AccordionContent className='flex flex-col gap-2'>
        <Link
          to='/room/$roomId'
          params={{
            roomId
          }}
          activeProps={{
            className: 'text-primary'
          }}
          activeOptions={{
            exact: true
          }}
        >
          <ToolLink>
            <Scroll className='h-8 w-8 flex-shrink-0 text-primary' />
            <div className='flex w-full justify-between'>
              <h1 className='font-decorative text-xl'>View story</h1>
              <span className='flex items-center gap-3 text-primary'>
                {displayBroadcastUnread && (
                  <span className='flex items-center gap-1'>
                    <p className='text-lg'>{numOfUnreadBroadcast}</p>
                    <MessageSquare />
                  </span>
                )}
                {displayStoryUnread && (
                  <span className='flex items-center gap-1'>
                    <p className='text-lg'>{numOfUnreadStory}</p>
                    <BookOpenText className='h-6 w-6' />
                  </span>
                )}
              </span>
            </div>
          </ToolLink>
        </Link>
        {isGameMaster ? (
          <>
            <Link
              to='/room/$roomId/submitStory'
              params={{
                roomId
              }}
              activeProps={{
                className: 'text-primary'
              }}
              activeOptions={{
                exact: true
              }}
            >
              <ToolLink>
                <Crown className='h-8 w-8 text-primary' />
                <h1 className='font-decorative text-xl'>Submit story chunk</h1>
              </ToolLink>
            </Link>
          </>
        ) : (
          <>
            <Link
              to='/room/$roomId/submitAction'
              params={{ roomId }}
              activeProps={{
                className: 'text-primary'
              }}
              activeOptions={{
                exact: true
              }}
            >
              <ToolLink>
                <CheckCircle className='h-8 w-8 text-primary' />
                <h1 className='font-decorative text-xl'>Submit action</h1>
              </ToolLink>
            </Link>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
