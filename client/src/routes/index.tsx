import { useAuth0 } from '@auth0/auth0-react';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSocketIO, useSocketIOEvent } from '@/hooks/socketio';

function IndexRoute() {
  useEffect(() => {
    document.querySelector('html')?.classList.add('dark');
  }, []);

  const [msg, setMsg] = useState<string>('');
  const [recv, setRecv] = useState<string[]>([]);

  const { getAccessTokenSilently } = useAuth0();

  const onMsg = (data: string) => {
    setRecv([data, ...recv]);
  };

  const { socket, connect } = useSocketIO();

  useSocketIOEvent('msg', onMsg);

  const onConnect = async () => {
    const token = await getAccessTokenSilently();

    connect(token);
  };

  const send = () => {
    socket?.emit('msg', msg);
  };

  const request = async () => {
    const token = await getAccessTokenSilently();
    const data = (await (
      await fetch('http://localhost:3000/api/test', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    ).json()) as unknown;
    console.log(data);
  };

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
          <Button onClick={() => void onConnect()}>Connect</Button>
          <Button onClick={send}>Click this to send</Button>
          <Button onClick={() => void request()}>Test auth api</Button>
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute('/')({
  component: IndexRoute
});
