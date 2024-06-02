import { ApiStoryChunk } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import shortUUID from 'short-uuid';

import { BroadcastChat } from '@/components/chat-utilities/Messages';
import { InputBar } from '@/components/InputBar';
import { SvgSpinner } from '@/components/Spinner';
import { StoryChunkContainer } from '@/components/story-utilities/StoryChunks';
import { Button } from '@/components/ui/button';
import { useFetchMessages } from '@/lib/api/fetchMessages';
import { useFetchStory } from '@/lib/api/fetchStory';
import { useMarkCurrentChat } from '@/lib/misc/markCurrentChat';
import { useSendMessage } from '@/lib/socket/sendMessage';
import { useSocket, useSocketEvent } from '@/lib/stores/socketIOStore';
import { useSocketSyncStore } from '@/lib/stores/socketSyncStore';

const route = getRouteApi('/_sidebar-layout/room/$roomId/');

function Story() {
  const { roomId } = route.useParams();
  const roomUUID = shortUUID().toUUID(roomId);
  const { data: story } = useFetchStory(roomUUID);
  const queryClient = useQueryClient();
  const { setStoryIsLive } = useSocketSyncStore();
  const socket = useSocket();

  useMarkCurrentChat('broadcast');

  useEffect(() => {
    setStoryIsLive(true);

    return () => {
      setStoryIsLive(false);
    };
  }, [setStoryIsLive]);

  useSocketEvent('newTurn', chunk => {
    if (!story) return;

    queryClient.setQueryData<ApiStoryChunk[]>(
      ['fetchStory', roomUUID],
      [
        ...story,
        { id: chunk.id, content: chunk.story, imageURL: chunk.imageURL }
      ]
    );

    if (socket) {
      socket.emit('markStoryRead', { roomID: roomUUID, chunkID: chunk.id });
    }
  });

  const {
    data: messages,
    hasNextPage,
    isFetching,
    fetchNextPage
  } = useFetchMessages(roomUUID, 'broadcast');
  const sendMessage = useSendMessage({
    roomUUID,
    receiver: 'broadcast'
  });

  useEffect(() => {
    queryClient.setQueryData<number>(['getUnreadStory', roomUUID], 0);

    const currentUnreadMessages = queryClient.getQueryData<
      Record<string, number>
    >(['getUnreadMessages', roomUUID]);

    queryClient.setQueryData(['getUnreadMessages', roomUUID], {
      ...currentUnreadMessages,
      broadcast: 0
    });
  }, [queryClient, roomUUID]);

  if (!story) {
    return (
      <div className='flex h-full w-full justify-center pt-20'>
        <SvgSpinner className='h-20 w-20' />
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col justify-end'>
      <div className='flex h-full flex-col justify-between'>
        <div className='flex h-full flex-col justify-end'>
          <StoryChunkContainer story={story} />
        </div>
        <Button className='mx-auto w-40' onClick={() => void fetchNextPage()}>
          Fetch
        </Button>
        <div className='h-fit max-h-[50%]'>
          {messages && (
            <BroadcastChat
              onReachTop={() => !isFetching && void fetchNextPage()}
              messages={messages.map(m => ({
                ...m,
                timestamp: new Date(m.timestamp)
              }))}
            />
          )}
        </div>
      </div>
      <InputBar handleSend={sendMessage} sendButtonText='Send' />
    </div>
  );
}

export const Route = createLazyFileRoute('/_sidebar-layout/room/$roomId/')({
  component: Story
});
