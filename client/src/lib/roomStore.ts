import { create } from 'zustand';

type RoomState = {
  roomName: string | undefined;
  roomPlayers: Character[];
  isCurrentPlayerGameMaster: boolean;
  currentPlayerName: string;
  currentPlayerURLImage: string | undefined;
};

type RoomActions = {
  setRoomName: (name: string) => void;
};

export type Character = {
  characterPictureURL: string | undefined;
  characterName: string;
  characterTurnSubmit: string | undefined;
  id: number;
};

const PLACEHOLDER_ROOM_PLAYERS: Character[] = [
  {
    id: 1,
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1',
    characterTurnSubmit: undefined
  },
  {
    id: 2,
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1',
    characterTurnSubmit: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    id: 3,
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1',
    characterTurnSubmit: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    id: 4,
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1',
    characterTurnSubmit: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

  },
  {
    id: 5,
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1',
    characterTurnSubmit: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    id: 6,
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1',
    characterTurnSubmit: undefined
  },
  {
    id: 7,
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1',
    characterTurnSubmit: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

  },
  {
    id: 8,
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1',
    characterTurnSubmit: undefined
  },
  {
    id: 9,
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1',
    characterTurnSubmit: undefined
  },
  {
    id: 10,
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1',
    characterTurnSubmit: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

  }
];

export const useRoomStore = create<RoomState & RoomActions>()(set => ({
  roomName: 'test room name',
  roomPlayers: PLACEHOLDER_ROOM_PLAYERS,
  isCurrentPlayerGameMaster: true,
  currentPlayerName: 'adam',
  currentPlayerURLImage:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY3q3HgtsmQrYhiCava6te52P-YM6roY_m1-u4vyR_vQ&s',
  setRoomName: (name: string) => set(_state => ({ roomName: name }))
}));
