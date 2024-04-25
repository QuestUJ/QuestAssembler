import { useAuth0 } from '@auth0/auth0-react';
import { DialogClose } from '@radix-ui/react-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { UUID } from 'crypto';
import { Crown, Swords } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { config } from '@/config';

const { API_BASE_URL } = config.pick(['API_BASE_URL']);

export function JoinGameDialog() {
  const [gameCode, setGameCode] = useState('');
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const joinGameMutation = useMutation({
    mutationFn: async (gameCode: string) => {
      // auth related validation
      if (!isAuthenticated) {
        throw new Error('NOT_AUTHENTICATED_ERROR');
      }
      const token = await getAccessTokenSilently();

      // API call
      const response = await fetch(`${API_BASE_URL}/api/v1/joinGame`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameCode }),
        signal: AbortSignal.timeout(10000)
      });

      // response handling
      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: 'Something went wrong when joining the room'
        });
        throw new Error(`Something went wrong ${response.status}`);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['roomFetch'] });
      }
      return response.status;
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='m-2 w-60 rounded'>Join Game</Button>
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
              onClick={() => joinGameMutation.mutate(gameCode)}
            >
              Join game
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CreateGameDialog() {
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(0);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { toast } = useToast();

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
      const response = await fetch(`${API_BASE_URL}/api/v1/createGame`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, maxPlayers }),
        signal: AbortSignal.timeout(10000)
      });

      // response handling
      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: 'Something went wrong when joining the room'
        });
        throw new Error(`Something went wrong ${response.status}`);
      } else {
        const data = (await response.json()) as { gameCode: string };
        toast({
          title: 'Room created succcessfully',
          description: `Your room game code is ${data.gameCode} `
        });
        await queryClient.invalidateQueries({ queryKey: ['roomFetch'] });
      }

      return response.status;
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

type RoomResponse = {
  id: UUID;
  roomName: string;
  gameMasterName: string;
  currentPlayers: number;
  maxPlayers: number;
  isCurrentUserGameMaster: boolean;
  lastImageUrl: string | undefined;
  lastMessages: string[] | undefined;
};

function RoomComponent({ room }: { room: RoomResponse }) {
  return (
    <div className='my-2 grid h-40 w-[450px] grid-cols-10 grid-rows-3 gap-0 rounded-xl border-2 bg-card lg:h-48 lg:w-[600px] [&>div]:border-zinc-800 [&>div]:p-1'>
      <div className='col-span-1 row-span-1 border-r-2'>
        {room.isCurrentUserGameMaster ? (
          <Crown className='h-full w-full p-1 text-primary lg:p-2' />
        ) : (
          <Swords className='h-full w-full p-1 text-primary lg:p-2' />
        )}
      </div>
      <div className='col-span-5 row-span-1 p-1'>
        <h1 className='text-xl lg:text-3xl'>{room.roomName}</h1>
        <h4 className='text-xs lg:text-sm'>
          <span className='text-secondary'>Game Master:</span>{' '}
          {room.gameMasterName}
        </h4>
      </div>
      <div className='col-span-1 row-span-1 flex flex-col items-center justify-center border-l-2 p-1'>
        <h1 className='text-sm'>
          {room.currentPlayers} / {room.maxPlayers}
        </h1>
        <h3 className='text-xs'>Players</h3>
      </div>
      <div className='col-span-3 row-span-3 flex items-center justify-center rounded-r-xl border-l-2 bg-zinc-950'>
        {room.lastImageUrl ? (
          <img src={room.lastImageUrl} alt='last image from room' />
        ) : (
          <h1 className='text-center'>Image unavailable</h1>
        )}
      </div>
      <div className='col-span-7 row-span-2 row-start-2 flex items-center justify-center border-t-2'>
        {room.lastMessages ? (
          <div>
            {room.lastMessages.map(message => (
              <h3>{message}</h3>
            ))}
          </div>
        ) : (
          <h1>Last messages unavailable</h1>
        )}
      </div>
    </div>
  );
}

function RoomOverview() {
  const { getAccessTokenSilently, loginWithRedirect, isAuthenticated } =
    useAuth0();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['roomFetch'],
    queryFn: async () => {
      // auth related validation
      if (!isAuthenticated) {
        throw new Error('NOT_AUTHENTICATED_ERROR');
      }
      const token = await getAccessTokenSilently();

      // API call
      const response = await fetch(`${API_BASE_URL}/api/v1/fetchRooms`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: AbortSignal.timeout(10000)
      });

      // response handling
      if (!response.ok) {
        throw new Error(`Something didn't work out, code: ${response.status}`);
      }
      return (await response.json()) as { rooms: RoomResponse[] };
    }
  });
  if (isError) {
    return (
      <div>
        {error.message === 'NOT_AUTHENTICATED_ERROR' ? (
          <div>
            <h1>You are not authenticated. Click here to authenticate: </h1>
            <Button
              className='rounded border'
              onClick={() => void loginWithRedirect()}
            >
              Authenticate
            </Button>
          </div>
        ) : (
          <h1>
            Something went terribly wrong. Can't fetch user rooms. Error:{' '}
            {error.message}
          </h1>
        )}
      </div>
    );
  }
  return (
    <div>
      {isPending ? (
        <div>Loading, please wait...</div>
      ) : (
        <div>
          {data.rooms &&
            data.rooms.map((room: RoomResponse) => (
              <RoomComponent room={room} key={room.id} />
            ))}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <div className='flex min-h-screen w-full'>
      <div style={{ flexGrow: 1, overflow: 'auto' }}>
        <RoomOverview />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/_auth/dashboard')({
  component: Dashboard
});
