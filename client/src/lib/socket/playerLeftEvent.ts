import { ApiPlayerPayload, SocketPlayerDetails } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from 'sonner';

import { useSocketEvent } from '../stores/socketIOStore';

export function usePlayerLeftEvent(
  roomUUID: string,
  avatar: (player: SocketPlayerDetails) => ReactNode
) {
  const queryClient = useQueryClient();

  useSocketEvent('playerLeft', player => {
    const players = queryClient.getQueryData<ApiPlayerPayload[]>([
      'getRoomPlayers',
      roomUUID
    ]);

    if (!players) return;

    queryClient.setQueryData<ApiPlayerPayload[]>(
      ['getRoomPlayers', roomUUID],
      players.filter(arrayPlayer => arrayPlayer.id !== player.id)
    );

    toast(player.nick, {
      description: 'has left the game!',
      icon: avatar(player)
    });
  });
}
