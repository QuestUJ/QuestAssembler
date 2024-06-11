import { ApiPlayerPayload, SocketPlayerDetails } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from 'sonner';

import { useSocketEvent } from '../stores/socketIOStore';

export function usePlayerReadyEvent(
  roomUUID: string,
  avatar: (player: SocketPlayerDetails) => ReactNode
) {
  const queryClient = useQueryClient();

  useSocketEvent('playerReady', characterID => {
    const players = queryClient.getQueryData<ApiPlayerPayload[]>([
      'getRoomPlayers',
      roomUUID
    ]);

    if (!players) return;

    const player = players.find(p => p.id === characterID);

    if (player) {
      toast(player.nick, {
        description: 'has ended their turn',
        icon: avatar(player)
      });
    }

    queryClient.setQueryData(
      ['getRoomPlayers', roomUUID],
      players.map(p => (p.id === characterID ? { ...p, isReady: true } : p))
    );
  });
}
