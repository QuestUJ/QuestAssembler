import { createLazyFileRoute } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { SocketErrorToast, useSocket } from '@/lib/socketIOStore';

function PlayerSubmit() {
  const [content, setContent] = useState('');

  const socket = useSocket();

  const { toast } = useToast();

  const submit = () => {
    if (!socket) {
      toast(SocketErrorToast);
    }

    console.log('Action!');
  };

  return (
    <div className='flex h-full w-full flex-col  items-center  pt-20'>
      <Textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className=' h-1/3 w-2/3'
        placeholder='Describe your actions in this turn'
      />
      <div className='flex w-2/3 justify-end py-4'>
        <Button
          className='flex w-48 items-center gap-2 font-bold'
          onClick={submit}
        >
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
