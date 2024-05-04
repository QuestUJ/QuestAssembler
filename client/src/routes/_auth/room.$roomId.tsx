import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import { MessageContainer } from '@/components/chatUtilities/Messages';
import { InputBar } from '@/components/InputBar';
import { useQuasmStore } from '@/lib/quasmStore';

function Room() {
  const messages = useQuasmStore(state => state.messages);
  const { setRoomName } = useQuasmStore();

  // This is temporarly for testing, remove and implement properly
  useEffect(() => {
    setRoomName('teslt 1');
  }, [setRoomName]);
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

export const Route = createFileRoute('/_auth/room/$roomId')({
  component: Room,
});
