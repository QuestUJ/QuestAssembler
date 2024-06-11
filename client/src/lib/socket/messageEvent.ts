import { ApiMessagePayload } from '@quasm/common';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from 'sonner';

import { AvatarProps } from '@/components/NotificationAvatar';

import { useSocket, useSocketEvent } from '../stores/socketIOStore';
import { useSocketSyncStore } from '../stores/socketSyncStore';

export function useMessageEvent(
  roomUUID: string,
  avatar: (player: AvatarProps) => ReactNode
) {
  const liveChat = useSocketSyncStore(state => state.liveChat);
  const queryClient = useQueryClient();

  const socket = useSocket();

  useSocketEvent('message', msg => {
    const key = msg.broadcast ? 'broadcast' : msg.from;

    if (liveChat !== key) {
      toast(`${msg.authorName}${msg.broadcast ? ' to everyone' : ''}`, {
        description: msg.content,
        icon: avatar({
          nick: msg.authorName,
          profileIMG: msg.characterPictureURL
        })
      });

      const unreadMessages = queryClient.getQueryData<Record<string, number>>([
        'getUnreadMessages',
        roomUUID
      ]);

      if (unreadMessages) {
        queryClient.setQueryData(['getUnreadMessages', roomUUID], {
          ...unreadMessages,
          [key]: unreadMessages[key] + 1
        });
      }
    } else if (socket) {
      socket.emit('markMessageRead', {
        roomID: roomUUID,
        senderID: key,
        messageID: msg.id
      });
    }

    const messages = queryClient.getQueryData<ApiMessagePayload[]>([
      'fetchMessages',
      roomUUID,
      key
    ]);

    if (messages) {
      queryClient.setQueryData<
        InfiniteData<ApiMessagePayload[], number | undefined>
      >(['fetchMessages', roomUUID, key], data => ({
        pages: data
          ? [[...data.pages[0], msg], ...data.pages.slice(1)]
          : [[msg]],
        pageParams: data ? [...data.pageParams] : [undefined]
      }));
    }
  });
}
