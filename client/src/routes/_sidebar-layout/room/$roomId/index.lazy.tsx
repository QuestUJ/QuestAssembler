import { ApiStoryChunk } from '@quasm/common';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import shortUUID from 'short-uuid';

import { BroadcastChat } from '@/components/chat-utilities/Messages';
import { InputBar } from '@/components/InputBar';
import { SvgSpinner } from '@/components/Spinner';
import { StoryChunkContainer } from '@/components/story-utilities/StoryChunks';
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
  const {
    data: story,
    isFetching: isFetchingStory,
    hasNextPage: hasNextPageOfStory,
    fetchNextPage: fetchNextPageOfStory
  } = useFetchStory(roomUUID);
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

    const chunkApiFormat = {
      id: chunk.id,
      content: chunk.story,
      imageURL: chunk.imageURL
    };

    queryClient.setQueryData<InfiniteData<ApiStoryChunk[], number | undefined>>(
      ['fetchStory', roomUUID],
      data => ({
        pages: data ? [[chunkApiFormat], ...data.pages] : [[chunkApiFormat]],
        pageParams: data ? [chunk.id, ...data.pageParams] : [chunk.id]
      })
    );

    if (socket) {
      socket.emit('markStoryRead', { roomID: roomUUID, chunkID: chunk.id });
    }
  });

  const {
    data: messages,
    hasNextPage: hasNextPageOfMessages,
    isFetching: isFetchingMessages,
    fetchNextPage: fetchNextPageOfMessages
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
      <div className='flex h-full w-full justify-center'>
        <SvgSpinner className='h-20 w-20' />
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col justify-end'>
      <div className=' flex h-[calc(100%-theme(space.20))] flex-col justify-end'>
        <div
          id='story-scroller'
          className='flex flex-shrink flex-grow basis-full flex-col-reverse overflow-y-auto'
        >
          <StoryChunkContainer
            story={story.pages}
            fetchMore={() => !isFetchingStory && void fetchNextPageOfStory()}
            hasMore={hasNextPageOfStory}
            loader={<SvgSpinner className='mx-auto h-20 w-20' />}
            containerID='story-scroller'
          />
        </div>
        <div className='max-h-[50%]'>
          <hr className='border-primary' />
          {messages ? (
            <BroadcastChat
              hasMore={hasNextPageOfMessages}
              fetchMore={() =>
                !isFetchingMessages && void fetchNextPageOfMessages()
              }
              messages={messages.pages.map(page =>
                page.map(m => ({
                  ...m,
                  timestamp: new Date(m.timestamp)
                }))
              )}
            />
          ) : (
            <SvgSpinner className='mx-auto h-20 w-20' />
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
