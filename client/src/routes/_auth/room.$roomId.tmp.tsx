import { createFileRoute } from '@tanstack/react-router';

import { MessageContainer } from '@/components/chatUtilities/Messages';
import { InputBar } from '@/components/InputBar';
import { useQuasmStore } from '@/lib/quasmStore';

function Room() {
  const messages = useQuasmStore(state => state.messages);

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

export const Route = createFileRoute('/_auth/room/$roomId/tmp')({
  component: Room
});
