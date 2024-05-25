import { useAuth0 } from '@auth0/auth0-react';
import { createLazyFileRoute } from '@tanstack/react-router';

import { RoomCard } from '@/components/RoomCard';
import { SvgSpinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { useFetchRooms } from '@/lib/api/fetchRooms';

function RoomOverview() {
  const { loginWithRedirect } = useAuth0();

  const { isPending, isError, data, error } = useFetchRooms();

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
    <>
      {isPending ? (
        <div className='flex w-full items-center justify-center'>
          <SvgSpinner className='h-20 w-20' />
        </div>
      ) : (
        <>{data && data.map(room => <RoomCard room={room} key={room.id} />)}</>
      )}
    </>
  );
}

function Dashboard() {
  return (
    <div className='flex w-full flex-wrap md:p-2'>
      <RoomOverview />
    </div>
  );
}

export const Route = createLazyFileRoute('/_auth/dashboard')({
  component: Dashboard
});
