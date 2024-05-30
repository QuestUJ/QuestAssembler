import { ApiMessagePayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import shortUUID from 'short-uuid';
import { toast } from 'sonner';

import {
  MessageContainer,
  OutletWrapper
} from '@/components/chat-utilities/Messages';
import { InputBar } from '@/components/InputBar';
import { SvgSpinner } from '@/components/Spinner';
import { useFetchMessages } from '@/lib/api/fetchMessages';
import { useSendMessage } from '@/lib/socket/sendMessage';
import { useSocketEvent } from '@/lib/stores/socketIOStore';

function PlayerChat() {
  const { roomId, characterId } = Route.useParams();

  const roomUUID = shortUUID().toUUID(roomId);
  const characterUUID = shortUUID().toUUID(characterId);

  const navigate = useNavigate();

  const sendMessage = useSendMessage({
    roomUUID,
    receiver: characterUUID
  });

  const { data, isPending } = useFetchMessages(roomUUID, characterUUID);

  const queryClient = useQueryClient();

  useSocketEvent('message', data => {
    toast(data.authorName, {
      description: data.content,
      icon: (
        <img
          className='rounded-full'
          src={data.characterPictureURL}
          alt={data.authorName}
        />
      )
    });

    const msg: ApiMessagePayload = {
      ...data,
      timestamp: new Date(data.timestamp)
    };

    queryClient.setQueryData<ApiMessagePayload[]>(
      ['fetchMessages', roomUUID, data.from],
      old => (old ? [...old, msg] : [msg])
    );
  });

  useSocketEvent('playerLeft', async player => {
    if (characterUUID == player.id) {
      await navigate({
        to: '/room/$roomId',
        params: {
          roomId: roomId
        }
      });
    }
  });

  return (
    <div className='flex h-full flex-col justify-end'>
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

export const Route = createLazyFileRoute(
  '/_sidebar-layout/room/$roomId/chat/$characterId'
)({
  component: PlayerChat
});
