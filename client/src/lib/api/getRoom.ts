import { useAuth0 } from '@auth0/auth0-react';
import { ApiRoomDetailsPayload } from '@quasm/common';
import { useQuery } from '@tanstack/react-query';

import { useErrorToast } from '../misc/errorToast';
import { fetchGET } from './core/fetchGET';

export function useGetRoom(roomUUID: string) {
  const path = `/getRoom/${roomUUID}`;

  const { getAccessTokenSilently } = useAuth0();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();

    return fetchGET<ApiRoomDetailsPayload>({
      path,
      token
    });
  };

  const query = useQuery({
    queryKey: ['getRoom', roomUUID],
    queryFn
  });

  useErrorToast(query.isError, query.error?.message);

  return query;
}
