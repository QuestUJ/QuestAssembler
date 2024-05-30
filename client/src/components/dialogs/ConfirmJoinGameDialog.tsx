import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import shortUUID from 'short-uuid';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useSocket } from '@/lib/stores/socketIOStore';
import { buildResponseErrorToast, SocketErrorTxt } from '@/lib/toasters';
import { useNavigate } from '@tanstack/react-router';

export function ConfirmJoinGameDialog({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const socket = useSocket();

  const joinRoom = () => {
    if (!socket) {
      toast.error(SocketErrorTxt);
      return;
    }

    socket.emit('joinRoom', shortUUID().toUUID(roomId), async res => {
      if (res.success) {
        toast('You have joined the room!');

        await queryClient.invalidateQueries({
          queryKey: ['fetchRooms']
        });

        await navigate({
            to: '/room/$roomId',
            params: {
              roomId
            }
          });
      } else {
        toast.error(...buildResponseErrorToast(res.error?.message));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Join Room</DialogTitle>
          <DialogDescription>Do you want to join this room?</DialogDescription>
        </DialogHeader>
        <div className='mt-4 flex justify-between'>
          <Button className='bg-secondary' onClick={() => setOpen(false)}>
            No
          </Button>
          <Button onClick={() => joinRoom()}>Yes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
