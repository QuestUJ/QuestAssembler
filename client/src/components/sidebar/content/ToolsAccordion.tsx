import { Link, useParams } from '@tanstack/react-router';
import { Crown, Reply, Scroll } from 'lucide-react';
import { ReactNode } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useQuasmStore } from '@/lib/quasmStore';

function ToolLink({ children }: { children: ReactNode }) {
  return (
    <div className='my-2 flex h-10 items-center rounded-xl hover:bg-highlight-foreground'>
      {children}
    </div>
  );
}

export function ToolsAccordion() {
  const isGameMaster = useQuasmStore(state => state.isGameMaster);
  const { roomId }: { roomId: string } = useParams({ strict: false });

  return (
    <AccordionItem value='tools'>
      <AccordionTrigger className='w-full text-2xl text-primary hover:text-primary-shaded'>
        Tools
      </AccordionTrigger>
      <AccordionContent className=''>
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
            <Scroll className='mr-2 h-8 w-8 text-primary' />
            <h1 className='text-xl'>View story</h1>
          </ToolLink>
        </Link>
        {isGameMaster ? (
          <>
            <Link
              to='/room/$roomId/'
              params={{
                roomId
              }}
              activeProps={{
                className: 'text-primary'
              }}
            >
              <ToolLink>
                <Crown className='mr-2 h-8 w-8 text-primary' />
                <h1 className='text-xl'>AI support</h1>
              </ToolLink>
            </Link>

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
                <Reply className='mr-2 h-8 w-8 text-primary' />
                <h1 className='text-xl'>Submit story chunk</h1>
              </ToolLink>
            </Link>
          </>
        ) : (
          <ToolLink>
            <Crown className='mr-2 h-8 w-8 text-primary' />
            <h1 className='text-xl'>Contact game master</h1>
          </ToolLink>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}