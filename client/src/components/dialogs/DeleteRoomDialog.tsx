import { DeleteRoomResponse } from '@quasm/common';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { useToast } from '../ui/use-toast';

async function deleteRoom(roomId: string, toast: any) {
  console.log(`Deleting room with ID: ${roomId}`);
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
}

export function DeleteRoomDialog() {
  const [open, setOpen] = useState(false);
  const { roomId }: { roomId: string } = useParams({
    strict: false
  });
  const { toast } = useToast();

  const handleDelete = async () => {
    const result = await deleteRoom(roomId, toast);
    if (result.success) {
      setOpen(false);
    }
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
