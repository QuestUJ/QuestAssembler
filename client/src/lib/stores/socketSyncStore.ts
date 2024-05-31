import { create } from 'zustand';

interface SocketSyncState {
  storyIsLive: boolean;
  liveChat: string | null;
}

interface SocketSyncActions {
  setStoryIsLive: (value: boolean) => void;
  setLiveChat: (value: string | null) => void;
}

export const useSocketSyncStore = create<SocketSyncState & SocketSyncActions>()(
  set => ({
    storyIsLive: false,
    broadcastIsLive: false,
    liveChat: null,

    setStoryIsLive: value =>
      set(() => ({
        storyIsLive: value
      })),

    setLiveChat: value =>
      set(() => ({
        liveChat: value
      }))
  })
);
