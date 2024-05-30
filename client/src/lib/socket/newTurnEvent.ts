import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useSocketEvent } from '../stores/socketIOStore';
import { useSocketSyncStore } from '../stores/socketSyncStore';

export function useNewTurnEvent(roomUUID: string) {
  const queryClient = useQueryClient();

  const storyIsLive = useSocketSyncStore(state => state.storyIsLive);

  useSocketEvent('newTurn', async () => {
    toast('Turn ended! New story chunk available');

    if (!storyIsLive) {
      await queryClient.invalidateQueries({
        queryKey: ['getUnreadStory', roomUUID]
      });
    }

    await queryClient.invalidateQueries({
      queryKey: ['getRoomPlayers', roomUUID]
    });
  });
}
