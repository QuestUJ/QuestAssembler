import { ApiPlayerPayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';

import { useSocketEvent } from '../stores/socketIOStore';

export function usePlayerReadyEvent(roomUUID: string) {
  const queryClient = useQueryClient();

  useSocketEvent('playerReady', characterID => {
    const players = queryClient.getQueryData<ApiPlayerPayload[]>([
      'getRoomPlayers',
      roomUUID
    ]);

    if (!players) return;

    queryClient.setQueryData(
      ['getRoomPlayers', roomUUID],
      players.map(p => (p.id === characterID ? { ...p, isReady: true } : p))
    );
  });
}
