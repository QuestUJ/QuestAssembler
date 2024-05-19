import { createLazyFileRoute } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function PlayerSubmit() {
  return (
    <div className='flex h-full w-full flex-col  items-center  pt-20'>
      <Textarea
        className=' h-1/3 w-2/3'
        placeholder='Describe your actions in this turn'
      />
      <div className='flex w-2/3 justify-end py-4'>
        <Button className='flex w-48 items-center gap-2 font-bold'>
          <CheckCircle />
          Submit action
        </Button>
      </div>
    </div>
  );
}

export const Route = createLazyFileRoute('/_auth/room/$roomId/submitAction')({
  component: PlayerSubmit
});
