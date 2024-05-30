import { ErrorCode } from '@quasm/common';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useSocket } from '../stores/socketIOStore';
import { buildResponseErrorToast } from '../toasters';
import { useParams } from '@tanstack/react-router';

export function useSubscribeToRoom(roomUUID: string) {
  const socket = useSocket();
  const { roomId }: { roomId: string } = useParams({
    strict: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribeToRoom', roomUUID, async res => {
      if (!res.success) {
        toast.error(...buildResponseErrorToast(res.error?.message));

        if (res.error?.code === ErrorCode.RoomNotFound) {
          console.log('the case');
          await navigate({
            to: '/joinRoom/$roomId',
            params: {
              roomId
            }
          });
        }
      }
    });
  }, [socket, roomUUID, navigate]);
}
