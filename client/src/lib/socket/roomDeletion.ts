import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { useSocketEvent } from '../stores/socketIOStore';

export function useRoomDeletionEvent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useSocketEvent('roomDeletion', async () => {
    await queryClient.invalidateQueries({
      queryKey: ['roomFetch']
    });
    toast.error('You have been redirected', {
      description: 'Room you were a part of has been deleted!'
    });
    await navigate({
      to: '/dashboard'
    });
    return;
  });
}
