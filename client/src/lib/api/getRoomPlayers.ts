import { useAuth0 } from '@auth0/auth0-react';
import { ApiPlayerPayload } from '@quasm/common';
import { useQuery } from '@tanstack/react-query';

import { useErrorToast } from '../misc/errorToast';
import { fetchGET } from './core/fetchGET';

export function useGetRoomPlayers(roomUUID: string) {
  const path = `/getRoomPlayers/${roomUUID}`;

  const { getAccessTokenSilently } = useAuth0();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();

    return fetchGET<ApiPlayerPayload[]>({
      path,
      token
    });
  };

  const query = useQuery({
    queryKey: ['getRoomPlayers', roomUUID],
    queryFn
  });

  useErrorToast(query.isError, query.error?.message);

  return query;
}
