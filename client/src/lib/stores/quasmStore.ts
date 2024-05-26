import { create } from 'zustand';

type QuasmState = {
  roomName: string | undefined;
  isGameMaster: boolean;
};

type QuasmActions = {
  setRoomName: (name: string | undefined) => void;
  setIsGameMaster: (val: boolean) => void;
};

export const useQuasmStore = create<QuasmState & QuasmActions>()(set => ({
  roomName: undefined,
  isGameMaster: true,

  roomID: undefined,
  currentPlayerName: 'adam',
  currentPlayerURLImage:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY3q3HgtsmQrYhiCava6te52P-YM6roY_m1-u4vyR_vQ&s',
  setRoomName: (name: string | undefined) => set(() => ({ roomName: name })),
  setIsGameMaster: (val: boolean) => set(() => ({ isGameMaster: val }))
}));

export const getIsOnDashboard = (state: QuasmState) =>
  state.roomName === undefined;
