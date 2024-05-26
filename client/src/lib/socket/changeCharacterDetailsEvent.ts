import { ApiPlayerPayload, ApiRoomDetailsPayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';

import { useSocketEvent } from '../stores/socketIOStore';

export function useChangeCharacterDetailsEvent(roomUUID: string) {
  const queryClient = useQueryClient();

  useSocketEvent('changeCharacterDetails', player => {
    const roomDetails = queryClient.getQueryData<ApiRoomDetailsPayload>([
      'getRoom',
      roomUUID
    ]);
    const players = queryClient.getQueryData<ApiPlayerPayload[]>([
      'getRoomPlayers',
      roomUUID
    ]);

    if (!roomDetails) {
      return;
    }

    if (player.id === roomDetails.currentPlayer.id) {
      queryClient.setQueryData<ApiRoomDetailsPayload>(['getRoom', roomUUID], {
        ...roomDetails,
        currentPlayer:
          player.id === roomDetails.currentPlayer.id
            ? player
            : roomDetails.currentPlayer
      });
    } else {
      if (!players) return;

      queryClient.setQueryData<ApiPlayerPayload[]>(
        ['getRoomPlayers', roomUUID],
        players.map(p => (p.id === player.id ? player : p))
      );
    }
  });
}
