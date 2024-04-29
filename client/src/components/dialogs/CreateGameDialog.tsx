import { useAuth0 } from '@auth0/auth0-react';
import { CreateRoomResponse } from '@quasm/common';
import { DialogClose } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { config } from '@/config';

const { API_BASE_URL } = config.pick(['API_BASE_URL']);

export function CreateGameDialog() {
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(0);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createGameMutation = useMutation({
    mutationFn: async ({
      name,
      maxPlayers
    }: {
      name: string;
      maxPlayers: number;
    }) => {
      // input related validation
      if (name === '') {
        toast({
          variant: 'destructive',
          title: 'Invalid input!',
          description: 'You must set non-empty name'
        });
        throw new Error('BAD_INPUT_ERROR');
      }
      // maxPlayer input validation handled by min prop in input

      // auth related validation
      if (!isAuthenticated) {
        throw new Error('NOT_AUTHENTICATED_ERROR');
      }
      const token = await getAccessTokenSilently();

      // API call
      const response = (await fetch(`${API_BASE_URL}/api/v1/createRoom`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, maxPlayers }),
        signal: AbortSignal.timeout(10000)
      }).then(res => res.json())) as CreateRoomResponse;

      // response handling
      if (!response.success) {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: response.error?.message
        });
        throw new Error(`Something went wrong ${response.error?.message}`);
      } else {
        toast({
          title: 'Room created succcessfully',
          description: `Your room game code is ${response.payload} `
        });
        await queryClient.invalidateQueries({ queryKey: ['roomFetch'] });
      }

      return response.success;
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='m-2 w-60 rounded'>Create Game</Button>
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
              onClick={() => createGameMutation.mutate({ name, maxPlayers })}
            >
              Create game
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
