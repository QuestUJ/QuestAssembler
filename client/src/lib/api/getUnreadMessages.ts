import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';

import { fetchGET } from './core/fetchGET';

export function useGetUnreadMessages(roomUUID: string) {
  const path = `/getUnreadMessages/${roomUUID}`;

  const { getAccessTokenSilently } = useAuth0();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();

    return fetchGET<Record<string, number>>({
      path,
      token
    });
  };

  const query = useQuery({
    queryKey: ['getUnreadMessages', roomUUID],
    queryFn
  });

  return query;
}
