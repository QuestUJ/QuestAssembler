import { createLazyFileRoute } from '@tanstack/react-router';

import {
  BroadcastChat,
  OutletWrapper,
  StoryChunkContainer
} from '@/components/chatUtilities/Messages';
import { InputBar } from '@/components/InputBar';
import { useQuasmStore } from '@/lib/quasmStore';
import { MessageDetails, StoryChunkDetails } from '@/lib/sharedTypes';

function Story() {
  const messages = useQuasmStore(state => state.messages as MessageDetails[]);
  const story = useQuasmStore(state => state.story as StoryChunkDetails[]); // temporary solution but it has to be changed to sockets anyway
  return (
    <div className='flex h-full flex-col justify-end'>
      <OutletWrapper>
        <StoryChunkContainer story={story} />
        <BroadcastChat messages={messages} />
      </OutletWrapper>
      <InputBar
        handleSend={() => console.log('send handled')}
        sendButtonText='Send'
      />
    </div>
  );
}

export const Route = createLazyFileRoute('/_auth/room/$roomId/')({
  component: Story
});
