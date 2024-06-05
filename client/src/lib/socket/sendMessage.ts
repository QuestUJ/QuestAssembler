import { ApiMessagePayload } from '@quasm/common';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useSocket } from '../stores/socketIOStore';
import { buildResponseErrorToast, SocketErrorTxt } from '../toasters';

interface Options {
  roomUUID: string;
  receiver: string;
}

export function useSendMessage({ roomUUID, receiver }: Options) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const sendMessage = (content: string) => {
    if (!socket) {
      toast(SocketErrorTxt);
      return;
    }

    socket.emit(
      'sendMessage',
      {
        roomID: roomUUID,
        receiver,
        content
      },
      res => {
        if (!res.success) {
          toast.error(...buildResponseErrorToast(res.error?.message));
          return;
        }

        const msg = res.payload!;

        queryClient.setQueryData<
          InfiniteData<ApiMessagePayload[], number | undefined>
        >(['fetchMessages', roomUUID, receiver], data => ({
          pages: data ? [[msg], ...data.pages] : [[msg]],
          pageParams: data ? [msg.id, ...data.pageParams] : [msg.id]
        }));
      }
    );
  };

  return sendMessage;
}
