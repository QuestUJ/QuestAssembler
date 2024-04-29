import { create } from "zustand"; 


type RoomState = {
    roomName: string | undefined;
};

type RoomActions = {
    setRoomName: (name: string) => void;
};

export const useRoomStore = create<RoomState & RoomActions>()(
    (set) => ({
        roomName: "test room name",
        setRoomName: (name: string) => set((_state) => ({roomName: name}))
    })
)
