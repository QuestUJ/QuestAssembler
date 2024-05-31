import { create } from 'zustand';

type QuasmState = {
  roomName: string | undefined;
  isGameMaster: boolean;
  maxPlayers: number;
  currentImageURL: string | undefined;
  currentImageBlob: Blob | undefined;
};

type QuasmActions = {
  setRoomName: (name: string | undefined) => void;
  setIsGameMaster: (val: boolean) => void;
  setMaxPlayers: (val: number) => void;
  setCurrentImageURL: (url: string) => void;
  setCurrentImageBlob: (imageBlob: Blob) => void;
};

export const useQuasmStore = create<QuasmState & QuasmActions>()(set => ({
  roomName: undefined,
  isGameMaster: true,
  maxPlayers: 0,
  currentImageURL: undefined,
  currentImageBlob: undefined,
  roomID: undefined,
  currentPlayerName: 'adam',
  currentPlayerURLImage:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY3q3HgtsmQrYhiCava6te52P-YM6roY_m1-u4vyR_vQ&s',
  setRoomName: (name: string | undefined) => set(() => ({ roomName: name })),
  setIsGameMaster: (val: boolean) => set(() => ({ isGameMaster: val })),
  setMaxPlayers: (val: number) => set(() => ({maxPlayers: val})),
  setCurrentImageURL: (url: string) =>
    set(() => ({
      currentImageURL: url
    })),
  setCurrentImageBlob: (imageBlob: Blob) =>
    set(() => ({
      currentImageBlob: imageBlob
    }))
}));

export const getIsOnDashboard = (state: QuasmState) =>
  state.roomName === undefined;
