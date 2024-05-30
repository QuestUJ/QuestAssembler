import { ApiPlayerPayload, SocketPlayerDetails } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from 'sonner';

import { useSocketEvent } from '../stores/socketIOStore';

export function useNewPlayerEvent(
  roomUUID: string,
  avatar: (player: SocketPlayerDetails) => ReactNode
) {
  const queryClient = useQueryClient();

  useSocketEvent('newPlayer', player => {
    const players = queryClient.getQueryData<ApiPlayerPayload[]>([
      'getRoomPlayers',
      roomUUID
    ]);

    if (!players) return;

    const playerQueryData: ApiPlayerPayload = {
      id: player.id,
      nick: player.nick,
      profileIMG: player.profileIMG,
      isReady: player.isReady
    };

    queryClient.setQueryData<ApiPlayerPayload[]>(
      ['getRoomPlayers', roomUUID],
      [...players, playerQueryData]
    );

    toast(player.nick, {
      description: 'has joined the game',
      icon: avatar(player)
    });
  });
}
