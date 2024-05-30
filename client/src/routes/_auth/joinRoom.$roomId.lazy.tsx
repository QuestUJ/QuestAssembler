import { createLazyFileRoute } from '@tanstack/react-router';
import { ConfirmJoinGameDialog } from '@/components/dialogs/ConfirmJoinGameDialog';
import { useParams } from '@tanstack/react-router';
import { withAuthenticationRequired } from '@auth0/auth0-react';

function joinRoom() {
  const { roomId }: { roomId: string } = useParams({
    strict: false
  });

  return (
    <div className='flex w-full flex-wrap md:p-10'>
      <ConfirmJoinGameDialog roomId={roomId} />
    </div>
  );
}

export const Route = createLazyFileRoute('/_auth/joinRoom/$roomId')({
  component: withAuthenticationRequired(joinRoom)
});
