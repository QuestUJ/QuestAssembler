import { ApiMessagePayload } from '@quasm/common';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import shortUUID from 'short-uuid';

import {
  MessageContainer,
  OutletWrapper
} from '@/components/chatUtilities/Messages';
import { InputBar } from '@/components/InputBar';
import { SvgSpinner } from '@/components/Spinner';
import { useApiGet } from '@/lib/api';
import { useSocketChat } from '@/lib/chat/socketChat';
import { useSocketEvent } from '@/lib/socketIOStore';

//TODO: redirect when chat with givent character doesn't exist (user typed something random into url)

function PlayerChat() {
  const { roomId, characterId } = Route.useParams();

  const roomUUID = shortUUID().toUUID(roomId);
  const characterUUID = shortUUID().toUUID(characterId);

  const navigate = useNavigate();

  const sendMessage = useSocketChat({
    roomUUID,
    characterUUID
  });

  const { data, isPending } = useApiGet<ApiMessagePayload[]>({
    path: `/fetchMessages/${roomUUID}?other=${characterUUID}`,
    queryKey: ['fetchMessages', roomUUID, characterUUID]
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
  '/_auth/room/$roomId/chat/$characterId'
)({
  component: PlayerChat
});