import { useAuth0 } from '@auth0/auth0-react';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { toast } from 'sonner';

import { ConfirmJoinGameDialog } from '@/components/dialogs/ConfirmJoinGameDialog';
import { SvgSpinner } from '@/components/Spinner';
import { buildResponseErrorToast } from '@/lib/toasters';

const route = getRouteApi('/joinRoom/$roomId');

function JoinRoom() {
  const { roomId } = route.useParams();

  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: `/joinRoom/${roomId}` }
    }).catch((e: string) => {
      toast.error(...buildResponseErrorToast(e));
    });

    return (
      <div className='flex h-screen w-screen justify-center pt-32'>
        <SvgSpinner className='h-32 w-32' />
      </div>
    );
  }

  return (
    <div className='flex w-full flex-wrap md:p-10'>
      <ConfirmJoinGameDialog roomId={roomId} />
    </div>
  );
}

export const Route = createFileRoute('/joinRoom/$roomId')({
  component: JoinRoom
});
