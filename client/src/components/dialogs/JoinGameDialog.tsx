import { DialogClose } from '@radix-ui/react-dialog';
import { useQueryClient } from '@tanstack/react-query';
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
import { useSocket } from '@/lib/socketIOStore';
import { getResponseErrorToast, SocketErrorToast } from '@/lib/toasters';

export function JoinGameDialog() {
  const [gameCode, setGameCode] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const socket = useSocket();

  const joinRoom = () => {
    if (!socket) {
      toast(SocketErrorToast);
      return;
    }

    socket.emit('joinRoom', shortUUID().toUUID(gameCode), async res => {
      if (res.success) {
        toast({
          title: 'You have joined the room!'
        });

        await queryClient.invalidateQueries({
          queryKey: ['roomFetch']
        });
      } else {
        toast(getResponseErrorToast(res.error));
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
