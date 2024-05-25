import { useAuth0 } from '@auth0/auth0-react';
import { ApiRoomPayload } from '@quasm/common';
import { useQuery } from '@tanstack/react-query';

import { useErrorToast } from '../misc/errorToast';
import { fetchGET } from './core/fetchGET';

export function useFetchRooms() {
  const path = '/fetchRooms';

  const { getAccessTokenSilently } = useAuth0();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();

    return fetchGET<ApiRoomPayload[]>({
      path,
      token
    });
  };
  const query = useQuery({
    queryKey: ['fetchRooms'],
    queryFn
  });

  useErrorToast(query.isError, query.error?.message);

  return query;
}
