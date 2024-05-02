import { create } from 'zustand';

import {
  CharacterDetails,
  MessageDetails,
  MessageTypes
} from '%/src/DataInterface.ts';
import {
  PLACEHOLDER_ROOM_PLAYERS,
  PLACEHOLDER_DUMMY_MESSAGES,
  PLACEHOLDER_DUMMY_STORY
} from './dummyData';

type RoomState = {
  roomName: string | undefined;
  roomCharacters: CharacterDetails[];
  isCurrentPlayerGameMaster: boolean;
  currentPlayerName: string;
  currentPlayerURLImage: string | undefined;
  messages: MessageDetails[];
  story: MessageTypes[];
};

type RoomActions = {
  setRoomName: (name: string) => void;
};

export const useRoomStore = create<RoomState & RoomActions>()(set => ({
  roomName: 'test room name',
  roomCharacters: PLACEHOLDER_ROOM_PLAYERS,
  isCurrentPlayerGameMaster: true,
  currentPlayerName: 'adam',
  messages: PLACEHOLDER_DUMMY_MESSAGES,
  story: PLACEHOLDER_DUMMY_STORY,
  currentPlayerURLImage:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY3q3HgtsmQrYhiCava6te52P-YM6roY_m1-u4vyR_vQ&s',
  setRoomName: (name: string) => set(_state => ({ roomName: name }))
}));
