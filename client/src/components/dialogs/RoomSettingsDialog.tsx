import { zodResolver } from '@hookform/resolvers/zod';
import {
  ErrorCode,
  ErrorMap,
  MAX_ROOM_NAME_LENGTH,
  MAX_ROOM_PLAYERS
} from '@quasm/common';
import { useParams } from '@tanstack/react-router';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import shortUUID from 'short-uuid';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSocket } from '@/lib/socketIOStore';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../ui/form';
import { useToast } from '../ui/use-toast';
import { DeleteRoomDialog } from './DeleteRoomDialog';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: ErrorMap[ErrorCode.RoomNameEmpty]
    })
    .max(MAX_ROOM_NAME_LENGTH, {
      message: ErrorMap[ErrorCode.MaxRoomName]
    }),
  maxPlayers: z.coerce
    .number()
    .int({
      message: ErrorMap[ErrorCode.MaxPlayersNotInteger]
    })
    .min(2, {
      message: ErrorMap[ErrorCode.MaxPlayersTooFew]
    })
    .max(MAX_ROOM_PLAYERS, {
      message: ErrorMap[ErrorCode.MaxPlayersTooMany]
    })
});

export function RoomSettingsDialog() {
  const [open, setOpen] = useState(false);
  const { roomId }: { roomId: string } = useParams({
    strict: false
  });
  const socket = useSocket();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      maxPlayers: 0
    }
  });

  // override and fill with actual settings change on the backend
  const formHandler: SubmitHandler<z.infer<typeof formSchema>> = data => {
    if (roomId) {
      if (!socket) {
        toast({
          title: 'Something went wrong!',
          variant: 'destructive',
          description: 'Socket is unavailable'
        });
      } else {
        socket.emit(
          'changeRoomSettings',
          {
            roomID: shortUUID().toUUID(roomId),
            name: data.name,
            maxPlayers: data.maxPlayers
          },
          res => {
            if (res.success) {
              toast({
                title: 'Room settings changed successfully'
              });
            } else {
              toast({
                title: 'Something went wrong!',
                variant: 'destructive',
                description: 'Server side error'
              });
            }
          }
        );
      }
    } else {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: 'Room id is unavailable'
      });
    }
    form.reset(undefined, { keepDirtyValues: true }); // keepDirtyValues here, I don't feel like we should ever reset this (after unsuccessful change user probably wants to use existing input anyway)
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='m-0 h-12 w-12 rounded p-0'>
          <Settings className='h-full text-background' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Room settings</DialogTitle>
          <DialogDescription>Change your room settings</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={e => void form.handleSubmit(formHandler)(e)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='mb-4'>
                  <FormControl>
                    <Input {...field} placeholder='Room name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='maxPlayers'
              render={({ field }) => (
                <FormItem className='mb-4'>
                  <FormControl>
                    <Input {...field} placeholder='Max amount of players' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-between'>
              <DeleteRoomDialog />
              <Button
                className='bg-supporting'
                type='button'
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type='submit'>Apply</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
