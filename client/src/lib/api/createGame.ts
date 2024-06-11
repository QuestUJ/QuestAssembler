import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchPOST } from './core/fetchPOST';

interface RoomSettings {
  name: string;
  maxPlayers: number;
}

export function useCreateGame(onSuccess: (code: string) => void) {
  const path = '/createRoom';

  const { getAccessTokenSilently } = useAuth0();

  const mutationFn = async (body: RoomSettings) => {
    const token = await getAccessTokenSilently();

    return fetchPOST<string, RoomSettings>({
      path,
      body,
      token
    });
  };

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async code => {
      await queryClient.invalidateQueries({
        queryKey: ['fetchRooms']
      });

      onSuccess(code);
    }
  });
}
