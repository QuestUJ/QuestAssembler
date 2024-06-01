import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useSocketEvent } from '../stores/socketIOStore';
import { useSocketSyncStore } from '../stores/socketSyncStore';

export function useNewTurnEvent(roomUUID: string) {
  const queryClient = useQueryClient();

  const storyIsLive = useSocketSyncStore(state => state.storyIsLive);

  useSocketEvent('newTurn', async () => {
    toast('Turn ended! New story chunk available');

    const currentUnread = queryClient.getQueryData<number>([
      'getUnreadStory',
      roomUUID
    ]);

    if (!storyIsLive && currentUnread !== undefined) {
      queryClient.setQueryData<number>(
        ['getUnreadStory', roomUUID],
        currentUnread + 1
      );
    }

    await queryClient.invalidateQueries({
      queryKey: ['getRoomPlayers', roomUUID]
    });
  });
}
