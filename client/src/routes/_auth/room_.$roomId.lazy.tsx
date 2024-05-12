import { createFileRoute, createLazyFileRoute } from '@tanstack/react-router';

import {
  BroadcastChat,
  OutletWrapper,
  StoryChunkContainer
} from '@/components/chatUtilities/Messages';
import { InputBar } from '@/components/InputBar';
import { useQuasmStore } from '@/lib/quasmStore';

function Story() {
  const messages = useQuasmStore(state => state.messages);
  const story = useQuasmStore(state => state.story);
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

export const Route = createLazyFileRoute('/_auth/room/$roomId')({
  component: Story
});
