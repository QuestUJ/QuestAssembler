import { DialogClose } from '@radix-ui/react-dialog';
import { useState } from 'react';

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

export function CreateGameDialog() {
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(0);
  const { toast } = useToast();

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
    }
  });

  return (
    <Dialog>
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
        <div>
          <Input
            type='text'
            placeholder='Room name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='mb-4'
          />
          <Input
            type='number'
            placeholder='Max amount of players'
            min='2'
            value={maxPlayers}
            onChange={e => setMaxPlayers(parseInt(e.target.value))}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='submit'
              onClick={() => createGame({ name, maxPlayers })}
            >
              Create game
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
