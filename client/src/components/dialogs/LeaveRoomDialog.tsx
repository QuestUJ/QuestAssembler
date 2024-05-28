import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import shortUUID from 'short-uuid';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSocket } from '@/lib/stores/socketIOStore';

export function LeaveRoomDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { roomId }: { roomId: string } = useParams({
    strict: false
  });
  const navigate = useNavigate();

  const leaveRoom = () => {
    if (!socket) {
      toast({
        title: 'Connection error! Try again.',
        variant: 'destructive'
      });
      return;
    }

    socket.emit('leaveRoom', shortUUID().toUUID(roomId), async res => {
      if (res.success) {
        toast({
          title: 'You have left the room!'
        });
        await navigate({ to: '/dashboard' });

        await queryClient.invalidateQueries({
          queryKey: ['roomFetch']
        });
      } else {
        toast({
          title: 'Something went wrong!',
          variant: 'destructive',
          description: res.error?.message
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='m-0 h-10 w-10 rounded p-2'>
          <LogOut className='h-full w-full' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Leave Room</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave the room?
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-between'>
          <Button
            className='bg-supporting'
            type='button'
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type='button' onClick={leaveRoom}>
            Leave
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
