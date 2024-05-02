import { InputBar } from '@/components/InputBar';
import { MessageContainer } from '@/components/chatUtilities/Messages';
import { useRoomStore } from '@/lib/roomStore';
import { createFileRoute } from '@tanstack/react-router';
function Story() {
  const story = useRoomStore(state => state.story);
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

export const Route = createFileRoute('/_room_layout/room/$roomId/story')({
  component: Story
});
