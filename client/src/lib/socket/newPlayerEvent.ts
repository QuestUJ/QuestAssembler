import { ApiPlayerPayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';

import { useSocketEvent } from '../stores/socketIOStore';

export function useNewPlayerEvent(roomUUID: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      [playerQueryData, ...players]
    );

    toast({
      title: player.nick,
      description: 'has joined the game!'
    });
  });
}
