import { useAuth0 } from '@auth0/auth0-react';
import { ApiTurnSubmitWithCharacterPayload } from '@quasm/common';
import { useQuery } from '@tanstack/react-query';

import { useErrorToast } from '../misc/errorToast';
import { fetchGET } from './core/fetchGET';

export function useFetchTurnSubmits(roomUUID: string) {
  const path = `/fetchTurnSubmits/${roomUUID}`;

  const { getAccessTokenSilently } = useAuth0();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();
    return fetchGET<ApiTurnSubmitWithCharacterPayload[]>({
      path,
      token
    });
  };

  const query = useQuery({
    queryKey: ['fetchTurnSubmits', roomUUID],
    queryFn
  });

  useErrorToast(query.isError, query.error?.message);

  return query;
}
