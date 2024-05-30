import { useAuth0 } from '@auth0/auth0-react';
import { ApiUnreadPayload } from '@quasm/common';
import { useQuery } from '@tanstack/react-query';

import { fetchGET } from './core/fetchGET';

export function useGetUnread(roomUUID: string) {
  const path = `/getUnread/${roomUUID}`;

  const { getAccessTokenSilently } = useAuth0();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();

    return fetchGET<ApiUnreadPayload>({
      path,
      token
    });
  };

  const query = useQuery({
    queryKey: ['getUnread', roomUUID],
    queryFn
  });

  return query;
}
