import { useAuth0 } from '@auth0/auth0-react';
import { JoinRoomResponse } from '@quasm/common';
import { DialogClose } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import shortUUID from 'short-uuid';

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
import { useApiPost } from '@/lib/api';

const { API_BASE_URL } = config.pick(['API_BASE_URL']);

export function JoinGameDialog() {
  const [gameCode, setGameCode] = useState('');
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { toast } = useToast();

  const queryClient = useQueryClient();
  //
  // const joinGameMutation = useMutation({
  //   mutationFn: async (gameCode: string) => {
  //     // auth related validation
  //     if (!isAuthenticated) {
  //       throw new Error('NOT_AUTHENTICATED_ERROR');
  //     }
  //     const token = await getAccessTokenSilently();
  //
  //     // API call
  //     const response = (await fetch(`${API_BASE_URL}/api/v1/joinRoom`, {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ gameCode: shortUUID().toUUID(gameCode) }),
  //       signal: AbortSignal.timeout(10000)
  //     }).then(res => res.json())) as JoinRoomResponse;
  //
  //     // response handling
  //     if (!response.success) {
  //       toast({
  //         variant: 'destructive',
  //         title: 'Something went wrong',
  //         description: response.error?.message
  //       });
  //       throw new Error(`Something went wrong ${response.error?.message}`);
  //     } else {
  //       await queryClient.invalidateQueries({ queryKey: ['roomFetch'] });
  //     }
  //     return response.success;
  //   }
  // });

  const { mutate: joinRoom } = useApiPost<string, { gameCode: string }>({
    path: '/joinRoom',
    invalidate: ['roomFetch'],
    onSuccess: name => {
      toast({
        title: name,
        description: 'You have joined the room!'
      });
    }
  });

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
            <Button
              type='submit'
              onClick={() =>
                joinRoom({ gameCode: shortUUID().toUUID(gameCode) })
              }
            >
              Join game
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
