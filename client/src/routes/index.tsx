import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { socket } from '@/lib/socketio';

function IndexRoute() {
  useEffect(() => {
    document.querySelector('html')?.classList.add('dark');
  }, []);

  const [msg, setMsg] = useState<string>('');
  const [recv, setRecv] = useState<string[]>([]);

  const connect = () => {
    socket.connect();
  };

  const send = () => {
    socket.emit('msg', msg);
  };

  useEffect(() => {
    socket.on('msg', (data: string) => {
      setRecv([...recv, data]);
    });
  });

  return (
    <>
      <div className='flex h-screen w-screen flex-col items-center justify-center gap-5'>
        {recv.map((str, i) => (
          <div
            key={i}
            className='w-1/5 animate-bounce rounded-xl border-2 border-primary p-2 text-left duration-500 repeat-1'
          >
            {str}
          </div>
        ))}
        <Input
          className='w-1/5'
          value={msg}
          onChange={e => setMsg(e.target.value)}
        />
        <div className='flex gap-2'>
          <Button onClick={connect}>Connect</Button>
          <Button onClick={send}>Click this to send</Button>
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute('/')({
  component: IndexRoute
});
