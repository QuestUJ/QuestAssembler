import { create } from 'zustand';

import {
  CharacterDetails,
  MessageDetails,
  MessageTypes
} from '%/src/DataInterface.ts';

import {
  PLACEHOLDER_DUMMY_MESSAGES,
  PLACEHOLDER_DUMMY_STORY,
  PLACEHOLDER_ROOM_PLAYERS
} from './dummyData';

type QuasmState = {
  roomName: string | undefined;
  roomID: string | undefined;
  roomCharacters: CharacterDetails[];
  isCurrentPlayerGameMaster: boolean;
  currentPlayerName: string;
  currentPlayerURLImage: string | undefined;
  messages: MessageDetails[];
  story: MessageTypes[];
};

type QuasmActions = {
  setRoomName: (name: string | undefined) => void;
};

export const useQuasmStore = create<QuasmState & QuasmActions>()(set => ({
  roomName: undefined,
  roomID: undefined,
  roomCharacters: PLACEHOLDER_ROOM_PLAYERS,
  isCurrentPlayerGameMaster: true,
  currentPlayerName: 'adam',
  messages: PLACEHOLDER_DUMMY_MESSAGES,
  story: PLACEHOLDER_DUMMY_STORY,
  currentPlayerURLImage:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY3q3HgtsmQrYhiCava6te52P-YM6roY_m1-u4vyR_vQ&s',
  setRoomName: (name: string | undefined) => set(() => ({ roomName: name }))
}));

export const getIsOnDashboard = (state: QuasmState) =>
  state.roomName === undefined;
