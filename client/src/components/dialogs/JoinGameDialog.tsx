import { DialogClose } from '@radix-ui/react-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import shortUUID from 'short-uuid';
import { toast } from 'sonner';

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
import { useSocket } from '@/lib/stores/socketIOStore';
import { buildResponseErrorToast, SocketErrorTxt } from '@/lib/toasters';

export function JoinGameDialog() {
  const [gameCode, setGameCode] = useState('');
  const queryClient = useQueryClient();

  const socket = useSocket();

  const joinRoom = () => {
    if (!socket) {
      toast.error(SocketErrorTxt);
      return;
    }

    socket.emit('joinRoom', shortUUID().toUUID(gameCode), async res => {
      if (res.success) {
        toast.success('You have joined the room!');

        await queryClient.invalidateQueries({
          queryKey: ['fetchRooms']
        });
      } else {
        toast.error(...buildResponseErrorToast(res.error?.message));
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
