import { createLazyFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import shortUUID from 'short-uuid';

import { MessageContainer } from '@/components/chat-utilities/Messages';
import { InputBar } from '@/components/InputBar';
import { SvgSpinner } from '@/components/Spinner';
import { useFetchMessages } from '@/lib/api/fetchMessages';
import { useMarkCurrentChat } from '@/lib/misc/markCurrentChat';
import { useSendMessage } from '@/lib/socket/sendMessage';
import { useSocket, useSocketEvent } from '@/lib/stores/socketIOStore';

function PlayerChat() {
  const { roomId, characterId } = Route.useParams();

  const roomUUID = shortUUID().toUUID(roomId);
  const characterUUID = shortUUID().toUUID(characterId);

  const navigate = useNavigate();

  const sendMessage = useSendMessage({
    roomUUID,
    receiver: characterUUID
  });

  const { data, isPending, isFetching, fetchNextPage, hasNextPage } =
    useFetchMessages(roomUUID, characterUUID);

  useMarkCurrentChat(characterUUID);

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

  const socket = useSocket();

  useSocketEvent('message', msg => {
    if (!socket) return;

    socket.emit('markMessageRead', {
      roomID: roomUUID,
      senderID: msg.from,
      messageID: msg.id
    });
  });

  return (
    <div className='flex h-full flex-col justify-end'>
      <div className='h-[calc(100%-theme(space.20))] w-full'>
        {isPending ? (
          <div className='w-ful flex h-full items-center justify-center'>
            <SvgSpinner className='h-20 w-20' />
          </div>
        ) : (
          <MessageContainer
            hasMore={hasNextPage}
            fetchMore={() => !isFetching && void fetchNextPage()}
            loader={<SvgSpinner className='h-20 w-20' />}
            containerID='chat-scroller'
            messages={data!.pages.map(page =>
              page.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) }))
            )}
          />
        )}
      </div>
      <InputBar handleSend={sendMessage} sendButtonText='Send' />
    </div>
  );
}

export const Route = createLazyFileRoute(
  '/_sidebar-layout/room/$roomId/chat/$characterId'
)({
  component: PlayerChat
});
