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
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useApiPost } from '@/lib/api';

import { z } from 'zod';
import {
  ErrorCode,
  ErrorMap,
  MAX_ROOM_NAME_LENGTH,
  MAX_ROOM_PLAYERS
} from '@quasm/common';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form
} from '../ui/form';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: ErrorMap[ErrorCode.MaxRoomName]
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
      message: ErrorMap[ErrorCode.MaxPlayersTooMuch]
    })
});

export function CreateGameDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      maxPlayers: 2
    }
  });

  const { mutate: createGame } = useApiPost<
    string,
    { name: string; maxPlayers: number }
  >({
    path: '/createRoom',
    invalidate: ['roomFetch'],

    onSuccess: code => {
      toast({
        title: 'Room created succcessfully',
        description: `Your room game code is ${code} `
      });
      form.reset();
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='m-2 w-4/5 rounded'>Create Game</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create game</DialogTitle>
          <DialogDescription>
            Provide room name and maximum number of players
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data: z.infer<typeof formSchema>) => {
              form.reset(undefined, { keepDirtyValues: true });
              createGame(data);
              setOpen(false);
            })}
          >
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
            <Button type='submit'>Create game</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
