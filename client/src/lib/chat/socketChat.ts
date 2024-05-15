import { ApiMessagePayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { useSocket, useSocketEvent } from '@/lib/socketIOStore';

interface Props {
  roomUUID: string;
  characterUUID: string;
}

export function useSocketChat({ roomUUID, characterUUID }: Props) {
  const socket = useSocket();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessage = (content: string) => {
    if (!socket) {
      toast({
        title: 'Connection issue! Try refreshing site!',
        variant: 'destructive'
      });
      return;
    }

    socket.emit(
      'sendMessage',
      {
        roomID: roomUUID,
        receiver: characterUUID,
        content
      },
      res => {
        if (!res.success) {
          toast({
            title: 'Sending failed',
            variant: 'destructive',
            description: res.error
          });
          return;
        }

        queryClient.setQueryData<ApiMessagePayload[]>(
          ['fetchMessages', roomUUID, characterUUID],
          old => (old ? [...old, res.payload!] : [res.payload!])
        );
      }
    );
  };

  useSocketEvent('message', data => {
    toast({
      title: data.authorName,
      description: data.content
    });

    queryClient.setQueryData<ApiMessagePayload[]>(
      ['fetchMessages', roomUUID, data.from],
      old => (old ? [...old, data] : [data])
    );
  });

  return sendMessage;
}
