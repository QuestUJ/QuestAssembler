import { useAuth0 } from '@auth0/auth0-react';
import { FetchRoomsResponse } from '@quasm/common';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { RoomCard } from '@/components/RoomCard';
import { Button } from '@/components/ui/button';
import { config } from '@/config';

const { API_BASE_URL } = config.pick(['API_BASE_URL']);

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
      const response = (await fetch(`${API_BASE_URL}/api/v1/fetchRooms`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: AbortSignal.timeout(10000)
      }).then(res => res.json())) as FetchRoomsResponse;

      // response handling
      if (!response.success) {
        throw new Error(response.error?.message);
      }

      return response.payload!;
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
          {data && data.map(room => <RoomCard room={room} key={room.id} />)}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <div className='flex w-full'>
      <div style={{ flexGrow: 1, overflow: 'auto' }}>
        <RoomOverview />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/_auth/dashboard')({
  component: Dashboard
});