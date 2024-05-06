import { ClientToServerEvents, ServerToClientEvents } from '@quasm/common';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

import { config } from '@/config';

interface SocketIOState {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
}

interface SocketIOActions {
  connectSocket: (token: string, onErr: (err: string) => void) => void;
}

const { SOCKET_URL } = config.pick(['SOCKET_URL']);

export const useSocketIO = create<SocketIOState & SocketIOActions>()(set => ({
  connectSocket: (token: string, onErr: (err: string) => void) => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      SOCKET_URL,
      {
        auth: { token }
      }
    );

    socket.on('connect_error', err => {
      onErr(err.message);
    });

    set(() => ({
      socket
    }));
  }
}));
