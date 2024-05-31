import { useEffect } from 'react';

import { useSocketSyncStore } from '../stores/socketSyncStore';

export function useMarkCurrentChat(chat: string) {
  const { setLiveChat } = useSocketSyncStore();

  useEffect(() => {
    setLiveChat(chat);

    return () => {
      setLiveChat(null);
    };
  }, [chat, setLiveChat]);
}
