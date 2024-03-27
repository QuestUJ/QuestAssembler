import { createContext, useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface ISocketIOContext {
  socket: Socket | null;
  connect: (token: string) => void;
}

export const socketioContext = createContext<ISocketIOContext>({
  socket: null,
  connect: () => {
    throw new Error('Connect callback undefined');
  }
});

export function useSocketIO(): ISocketIOContext {
  const ctx = useContext(socketioContext);

  return ctx;
}

export function useSocketIOEvent<T>(event: string, handler: (arg: T) => void) {
  const { socket } = useContext(socketioContext);

  useEffect(() => {
    socket?.on(event, handler);

    return () => {
      socket?.removeListener(event, handler);
    };
  }, [socket, handler, event]);
}
