import { useEffect } from 'react';

import { useToast } from '@/components/ui/use-toast';

import { useSocket } from '../stores/socketIOStore';
import { buildResponseErrorToast } from '../toasters';

export function useSubscribeToRoom(roomUUID: string) {
  const socket = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribeToRoom', roomUUID, res => {
      if (!res.success) {
        toast(buildResponseErrorToast(res.error));
      }
    });
  }, [socket, roomUUID, toast]);
}
