import {
  CharacterDetails,
  MessageDetails,
  StoryChunkDetails
} from '@quasm/common/';
import { create } from 'zustand';

import {
  PLACEHOLDER_DUMMY_MESSAGES,
  PLACEHOLDER_DUMMY_STORY,
  PLACEHOLDER_ROOM_PLAYERS
} from './dummyData';

type QuasmState = {
  roomName: string | undefined;
  roomCharacters: CharacterDetails[];
  isGameMaster: boolean;
  currentPlayerName: string;
  currentPlayerURLImage: string | undefined;
  messages: MessageDetails[];
  story: StoryChunkDetails[];
};

type QuasmActions = {
  setRoomName: (name: string | undefined) => void;
  setIsGameMaster: (val: boolean) => void;
};

export const useQuasmStore = create<QuasmState & QuasmActions>()(set => ({
  roomName: undefined,
  isGameMaster: true,

  roomID: undefined,
  roomCharacters: PLACEHOLDER_ROOM_PLAYERS,
  currentPlayerName: 'adam',
  messages: PLACEHOLDER_DUMMY_MESSAGES,
  story: PLACEHOLDER_DUMMY_STORY,
  currentPlayerURLImage:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY3q3HgtsmQrYhiCava6te52P-YM6roY_m1-u4vyR_vQ&s',
  setRoomName: (name: string | undefined) => set(() => ({ roomName: name })),
  setIsGameMaster: (val: boolean) => set(() => ({ isGameMaster: val }))
}));

export const getIsOnDashboard = (state: QuasmState) =>
  state.roomName === undefined;
