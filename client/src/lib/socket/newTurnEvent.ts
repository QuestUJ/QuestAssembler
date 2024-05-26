import { useQueryClient } from '@tanstack/react-query';

import { useSocketEvent } from '../stores/socketIOStore';

export function useNewTurnEvent(roomUUID: string) {
  const queryClient = useQueryClient();

  useSocketEvent('newTurn', async () => {
    await queryClient.invalidateQueries({
      queryKey: ['getRoomPlayers', roomUUID]
    });
  });
}
