import { ReactNode, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { socketioContext } from '@/hooks/socketio';

interface Props {
  children: ReactNode;
}

export function SocketIOProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connect = (token: string) => {
    setSocket(
      io('http://localhost:3000/', {
        auth: {
          token
        }
      })
    );
  };

  return (
    <socketioContext.Provider
      value={{
        socket,
        connect
      }}
    >
      {children}
    </socketioContext.Provider>
  );
}
