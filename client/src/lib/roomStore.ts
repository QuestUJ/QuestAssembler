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

type Character = {
  characterPictureURL: string | undefined;
  characterName: string;
};

const PLACEHOLDER_ROOM_PLAYERS: Character[] = [
  {
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1'
  },
  {
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1'
  },
  {
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1'
  },
  {
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1'
  },
  {
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1'
  },
  {
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1'
  },
  {
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1'
  },
  {
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1'
  },
  {
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1'
  },
  {
    characterPictureURL:
      'https://as1.ftcdn.net/v2/jpg/05/78/94/44/1000_F_578944489_ZyfZPsK703HOOx8E08NnacYXyMoG7qJY.jpg',
    characterName: 'Test 1'
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
