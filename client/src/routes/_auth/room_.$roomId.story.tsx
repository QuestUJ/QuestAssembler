import { createFileRoute } from '@tanstack/react-router';

import { MessageContainer } from '@/components/chatUtilities/Messages';
import { InputBar } from '@/components/InputBar';
import { useQuasmStore } from '@/lib/quasmStore';

function Story() {
  const story = useQuasmStore(state => state.story);
  return (
    <div className='flex h-full flex-col justify-end'>
      <MessageContainer messages={story} />
      <InputBar
        handleSend={() => console.log('send handled')}
        sendButtonText='Send'
      />
    </div>
  );
}

export const Route = createFileRoute('/_auth/room/$roomId/story')({
  component: Story
});
