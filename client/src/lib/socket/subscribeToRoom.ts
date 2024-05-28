import { ErrorCode } from '@quasm/common';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useSocket } from '../stores/socketIOStore';
import { buildResponseErrorToast } from '../toasters';

export function useSubscribeToRoom(roomUUID: string) {
  const socket = useSocket();

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribeToRoom', roomUUID, async res => {
      if (!res.success) {
        toast.error(...buildResponseErrorToast(res.error?.message));

        if (res.error?.code === ErrorCode.RoomNotFound) {
          await navigate({
            to: '/dashboard'
          });
        }
      }
    });
  }, [socket, roomUUID, navigate]);
}
