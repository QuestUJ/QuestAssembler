import { useParams } from '@tanstack/react-router';
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
import { useSocket } from '@/lib/socketIOStore';

import { useToast } from '../ui/use-toast';

/* async function deleteRoom(roomId: string, toast: any) {


  /* console.log(`Deleting room with ID: ${roomId}`);
  try {
    const response: Response = await fetch(`/deleteRoom/${roomId}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`Failed to delete room: ${roomId}`);
      throw new Error('Failed to delete room');
    }

    const result: DeleteRoomResponse = await response.json();

    if (result.success) {
      toast({
        title: 'Room deleted successfully'
      });
      return { success: true };
    } else {
      throw new Error(result.error?.message || 'Failed to delete room');
    }
  } catch (error) {
    console.error('Error:', error);
    toast({
      title: 'Cannot delete room!',
      variant: 'destructive',
      description: 'Server error'
    });
    return { success: false, message: 'Server error' };
  }
} */

export function DeleteRoomDialog() {
  const [open, setOpen] = useState(false);
  const { roomId }: { roomId: string } = useParams({
    strict: false
  });
  const { toast } = useToast();

  const socket = useSocket();

  const handleDelete = () => {
    if (!socket) {
      toast({
        title: 'Error',
        description: 'Socket is unavailable',
        variant: 'destructive'
      });
      return;
    }

    socket.emit('deleteRoom', { roomID: shortUUID().toUUID(roomId) }, res => {
      if (res.success) {
        toast({
          title: 'Success!',
          description: 'Successfully deleted the room!'
        });
      } else {
        toast({
          title: 'Error!',
          description: 'Cannot delete the room.'
        });
      }
    });
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
          <Button className='bg-secondary' onClick={() => setOpen(false)}>
            No, I was just joking
          </Button>
          <Button className='bg-destructive' onClick={handleDelete}>
            Yes, let's end this story
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
