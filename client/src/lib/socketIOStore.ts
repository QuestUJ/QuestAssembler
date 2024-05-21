import { ClientToServerEvents, ServerToClientEvents } from '@quasm/common';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

import { config } from '@/config';

type QuasmSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketIOState {
  socket?: QuasmSocket;
}

interface SocketIOActions {
  connectSocket: (token: string, onErr: (err: string) => void) => void;
}

const { SOCKET_URL } = config.pick(['SOCKET_URL']);

export const useIOStore = create<SocketIOState & SocketIOActions>()(set => ({
  connectSocket: (token: string, onErr: (err: string) => void) => {
    const socket: QuasmSocket = io(SOCKET_URL, {
      auth: { token },
      reconnectionDelay: 5000
    });

    socket.on('connect_error', err => {
      onErr(err.message);
    });

    set(() => ({
      socket
    }));
  }
}));

export function useSocket() {
  const socket = useIOStore(state => state.socket);

  return socket;
}

export function useSocketEvent<T extends keyof ServerToClientEvents>(
  event: T,
  handler: T extends keyof ServerToClientEvents
    ? ServerToClientEvents[T]
    : never
) {
  const socket = useIOStore(state => state.socket);

  useEffect(() => {
    if (!socket) return;

    //@ts-expect-error Argument
    socket.on(event, handler);

    return () => {
      //@ts-expect-error Argument
      socket.off(event, handler);
    };
  }, [event, handler, socket]);
}

export const SocketErrorToast: { title: string; variant: 'destructive' } = {
  title: 'Connection issue! Try refreshing site!',
  variant: 'destructive'
};
