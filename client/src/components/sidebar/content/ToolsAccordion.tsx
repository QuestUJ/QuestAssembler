import { Link, useParams } from '@tanstack/react-router';
import { CheckCircle, Crown, Reply, Scroll } from 'lucide-react';
import { ReactNode } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useQuasmStore } from '@/lib/quasmStore';

function ToolLink({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-14 items-center gap-2 rounded-xl p-2 hover:bg-highlight-foreground'>
      {children}
    </div>
  );
}

export function ToolsAccordion() {
  const isGameMaster = useQuasmStore(state => state.isGameMaster);
  const { roomId }: { roomId: string } = useParams({ strict: false });

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
            <Scroll className='h-8 w-8 text-primary' />
            <h1 className='font-decorative text-xl'>View story</h1>
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
                <Crown className='h-8 w-8 text-primary' />
                <h1 className='font-decorative text-xl'>AI support</h1>
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
                <Reply className='h-8 w-8 text-primary' />
                <h1 className='font-decorative text-xl'>Submit story chunk</h1>
              </ToolLink>
            </Link>
          </>
        ) : (
          <>
            <ToolLink>
              <Crown className='h-8 w-8 text-primary' />
              <h1 className='font-decorative text-xl'>Contact game master</h1>
            </ToolLink>
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
