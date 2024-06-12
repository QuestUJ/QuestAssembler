import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import shortUUID from 'short-uuid';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useSocket } from '@/lib/stores/socketIOStore';
import { buildResponseErrorToast, SocketErrorTxt } from '@/lib/toasters';

import { SvgSpinner } from '../Spinner';

export function DeleteRoomDialog() {
  const [open, setOpen] = useState(false);
  const { roomId }: { roomId: string } = useParams({
    strict: false
  });

  const socket = useSocket();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    if (!socket) {
      toast.error(SocketErrorTxt);
      return;
    }

    socket.emit('deleteRoom', { roomID: shortUUID().toUUID(roomId) }, res => {
      if (res.success) {
        toast.success('Success!', {
          description: 'Successfully deleted the room!'
        });
      } else {
        toast.error(...buildResponseErrorToast(res.error?.message));
      }
      setIsLoading(false);
    });

    setIsLoading(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-destructive'>Delete Room</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Do you really want to delete the room?
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4 flex justify-between'>
          {isLoading ? (
            <SvgSpinner className='mx-auto h-20 w-20' />
          ) : (
            <>
              <Button className='bg-secondary' onClick={() => setOpen(false)}>
                No, I was just joking
              </Button>
              <Button className='bg-destructive' onClick={handleDelete}>
                Yes, let's end this story
              </Button>{' '}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
