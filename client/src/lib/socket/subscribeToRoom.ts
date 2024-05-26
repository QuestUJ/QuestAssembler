import { ErrorCode } from '@quasm/common';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { useToast } from '@/components/ui/use-toast';

import { useSocket } from '../stores/socketIOStore';
import { buildResponseErrorToast } from '../toasters';

export function useSubscribeToRoom(roomUUID: string) {
  const socket = useSocket();
  const { toast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribeToRoom', roomUUID, async res => {
      if (!res.success) {
        toast(buildResponseErrorToast(res.error?.message));

        if (res.error?.code === ErrorCode.RoomNotFound) {
          await navigate({
            to: '/dashboard'
          });
        }
      }
    });
  }, [socket, roomUUID, toast, navigate]);
}
