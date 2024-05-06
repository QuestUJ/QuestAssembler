import { DialogClose } from '@radix-ui/react-dialog';
import { useState } from 'react';
import shortUUID from 'short-uuid';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useApiPost } from '@/lib/api';
import { useSocketIO } from '@/lib/socketIOStore';

export function JoinGameDialog() {
  const [gameCode, setGameCode] = useState('');
  const { toast } = useToast();

  const { mutate } = useApiPost<string, { gameCode: string }>({
    path: '/joinRoom',
    invalidate: ['roomFetch'],
    onSuccess: name => {
      toast({
        title: name,
        description: 'You have joined the room!'
      });
    }
  });

  const socket = useSocketIO(state => state.socket);

  const joinRoom = () => {
    if (!socket) {
      toast({
        title: 'Connection error!',
        variant: 'destructive'
      });

      return;
    }

    socket.emit('joinRoom', shortUUID().toUUID(gameCode), res => {
      if (res.success) {
        toast({
          title: 'You have joined the room!'
        });
      } else {
        toast({
          title: 'Something went wrong!',
          variant: 'destructive',
          description: res.error
        });
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='m-2 w-4/5 rounded'>Join Game</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Join game</DialogTitle>
          <DialogDescription>Input game's code to join.</DialogDescription>
        </DialogHeader>
        <div>
          <Input
            type='text'
            placeholder='Game code'
            value={gameCode}
            onChange={e => setGameCode(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='submit' onClick={() => joinRoom()}>
              Join game
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
