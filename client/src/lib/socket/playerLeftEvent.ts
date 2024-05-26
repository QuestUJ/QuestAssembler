import { ApiPlayerPayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';

import { useSocketEvent } from '../stores/socketIOStore';

export function usePlayerLeftEvent(roomUUID: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

    toast({
      title: player.nick,
      description: 'has left the game!'
    });
  });
}
