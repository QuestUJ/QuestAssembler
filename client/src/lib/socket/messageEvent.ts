import { ApiMessagePayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from 'sonner';

import { AvatarProps } from '@/components/NotificationAvatar';

import { useSocketEvent } from '../stores/socketIOStore';
import { useSocketSyncStore } from '../stores/socketSyncStore';

export function useMessageEvent(
  roomUUID: string,
  avatar: (player: AvatarProps) => ReactNode
) {
  const liveChat = useSocketSyncStore(state => state.liveChat);
  const queryClient = useQueryClient();

  useSocketEvent('message', async msg => {
    const key = msg.broadcast ? 'broadcast' : msg.from;

    if (liveChat !== key) {
      toast(`${msg.authorName}${msg.broadcast ? ' to everyone' : ''}`, {
        description: msg.content,
        icon: avatar({
          nick: msg.authorName,
          profileIMG: msg.characterPictureURL
        })
      });

      await queryClient.invalidateQueries({
        queryKey: ['getUnreadMessages', roomUUID]
      });
    }

    const messages = queryClient.getQueryData<ApiMessagePayload[]>([
      'fetchMessages',
      roomUUID,
      key
    ]);

    if (messages) {
      queryClient.setQueryData<ApiMessagePayload[]>(
        ['fetchMessages', roomUUID, key],
        [...messages, msg]
      );
    }
  });
}
