import { ApiMessagePayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';

import { useSocket } from '../stores/socketIOStore';
import { buildResponseErrorToast, SocketErrorToast } from '../toasters';

interface Options {
  roomUUID: string;
  receiver: string;
}

export function useSendMessage({ roomUUID, receiver }: Options) {
  const socket = useSocket();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessage = (content: string) => {
    if (!socket) {
      toast(SocketErrorToast);
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
          toast(buildResponseErrorToast(res.error?.message));
          return;
        }

        const msg: ApiMessagePayload = {
          ...res.payload!,
          timestamp: new Date(res.payload!.timestamp)
        };

        queryClient.setQueryData<ApiMessagePayload[]>(
          ['fetchMessages', roomUUID, receiver],
          old => (old ? [...old, msg] : [msg])
        );
      }
    );
  };

  return sendMessage;
}
