import { ApiStoryChunk } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import shortUUID from 'short-uuid';

import {
  BroadcastChat,
  OutletWrapper
} from '@/components/chat-utilities/Messages';
import { InputBar } from '@/components/InputBar';
import { SvgSpinner } from '@/components/Spinner';
import { StoryChunkContainer } from '@/components/story-utilities/StoryChunks';
import { useFetchMessages } from '@/lib/api/fetchMessages';
import { useFetchStory } from '@/lib/api/fetchStory';
import { useSocketEvent } from '@/lib/stores/socketIOStore';

const route = getRouteApi('/_sidebar-layout/room/$roomId/');

function Story() {
  const { roomId } = route.useParams();

  const roomUUID = shortUUID().toUUID(roomId);

  const { data: story } = useFetchStory(roomUUID);

  const queryClient = useQueryClient();

  useSocketEvent('newTurn', chunk => {
    if (!story) return;

    queryClient.setQueryData<ApiStoryChunk[]>(
      ['fetchStory', roomUUID],
      [
        ...story,
        { id: chunk.id, content: chunk.story, imageURL: chunk.imageURL }
      ]
    );
  });

  const { data: messages } = useFetchMessages(roomUUID, 'broadcast');

  if (!story) {
    return (
      <div className='flex h-full w-full justify-center pt-20'>
        <SvgSpinner className='h-20 w-20' />
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col justify-end'>
      <OutletWrapper>
        <StoryChunkContainer
          story={story.map(s => ({ type: 'storychunk', ...s }))}
        />
        {messages ? (
          <BroadcastChat messages={messages} />
        ) : (
          <div className='flex h-full w-full justify-center'>
            <SvgSpinner className='h-20 w-20' />
          </div>
        )}
      </OutletWrapper>
      <InputBar
        handleSend={() => console.log('send handled')}
        sendButtonText='Send'
      />
    </div>
  );
}

export const Route = createLazyFileRoute('/_sidebar-layout/room/$roomId/')({
  component: Story
});
