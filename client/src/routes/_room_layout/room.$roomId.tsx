import { InputBar } from '@/components/InputBar';
import { MessageContainer } from '@/components/chatUtilities/Messages';
import { useRoomStore } from '@/lib/roomStore';
import { createFileRoute } from '@tanstack/react-router';

function Room() {
  const messages = useRoomStore(state => state.messages);
  return (
    <div className='flex h-full flex-col justify-end'>
      {/**TODO: replace for actual room data */}
      <MessageContainer messages={messages} />
      <InputBar
        handleSend={() => console.log('send handled')}
        sendButtonText='Send'
      />
    </div>
  );
}

export const Route = createFileRoute('/_room_layout/room/$roomId')({
  component: Room
});
