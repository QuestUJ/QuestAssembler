import { ApiRoomDetailsPayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';

import { useQuasmStore } from '../stores/quasmStore';
import { useSocketEvent } from '../stores/socketIOStore';

export function useChangeRoomSettingsEvent(roomUUID: string) {
  const queryClient = useQueryClient();
  const setRoomName = useQuasmStore(state => state.setRoomName);

  useSocketEvent('changeRoomSettings', roomData => {
    const roomDetails = queryClient.getQueryData<ApiRoomDetailsPayload>([
      'getRoom',
      roomUUID
    ]);

    if (!roomDetails) return;

    setRoomName(roomData.name);
  });
}
