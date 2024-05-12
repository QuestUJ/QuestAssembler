import { ApiMessagePayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, createLazyFileRoute, createLazyRoute } from '@tanstack/react-router';
import shortUUID from 'short-uuid';

import {
  MessageContainer,
  OutletWrapper
} from '@/components/chatUtilities/Messages';
import { InputBar } from '@/components/InputBar';
import { SvgSpinner } from '@/components/Spinner';
import { useToast } from '@/components/ui/use-toast';
import { useApiGet } from '@/lib/api';
import { useSocket, useSocketEvent } from '@/lib/socketIOStore';

function PlayerChat() {
  const socket = useSocket();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { roomId, characterId } = Route.useParams();

  const roomUUID = shortUUID().toUUID(roomId);
  const characterUUID = shortUUID().toUUID(characterId);

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
            variant: 'destructive'
          });
          return;
        }

        queryClient.setQueryData<ApiMessagePayload[]>(
          ['fetchMessages', roomUUID, characterUUID],
          old => (old ? [...old, res.payload] : [res.payload])
        );
      }
    );
  };

  // TODO!: Filtering events outside active chat
  useSocketEvent('message', data => {
    toast({
      title: data.authorName,
      description: data.content
    });
    queryClient.setQueryData<ApiMessagePayload[]>(
      ['fetchMessages', roomUUID, characterUUID],
      old => (old ? [...old, data] : [data])
    );
  });

  const { data, isPending } = useApiGet<ApiMessagePayload[]>({
    path: `/fetchMessages/${roomUUID}?other=${characterUUID}`,
    queryKey: ['fetchMessages', roomUUID, characterUUID]
  });

  return (
    <div className='flex h-full flex-col justify-end'>
      {/**TODO: replace for actual room data */}
      <OutletWrapper>
        {isPending ? (
          <div className='w-ful flex h-full items-center justify-center'>
            <SvgSpinner className='h-20 w-20' />
          </div>
        ) : (
          <MessageContainer
            messages={
              data?.map(m => ({
                ...m,
                type: 'message',
                timestamp: new Date(m.timestamp)
              })) ?? []
            }
          />
        )}
      </OutletWrapper>
      <InputBar handleSend={sendMessage} sendButtonText='Send' />
    </div>
  );
}

export const Route = createLazyFileRoute('/_auth/room/$roomId/chat/$characterId')({
  component: PlayerChat
});
