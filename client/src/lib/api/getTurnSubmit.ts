import { useAuth0 } from '@auth0/auth0-react';
import { ApiTurnSubmitPayload } from '@quasm/common';
import { useQuery } from '@tanstack/react-query';

import { useErrorToast } from '../misc/errorToast';
import { fetchGET } from './core/fetchGET';

export function useGetTurnSubmit(roomUUID: string) {
  const path = `/getTurnSubmit/${roomUUID}`;

  const { getAccessTokenSilently } = useAuth0();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();
    return fetchGET<ApiTurnSubmitPayload>({
      path,
      token
    });
  };

  const query = useQuery({
    queryKey: ['getTurnSubmit', roomUUID],
    queryFn
  });

  useErrorToast(query.isError, query.error?.message);

  return query;
}
