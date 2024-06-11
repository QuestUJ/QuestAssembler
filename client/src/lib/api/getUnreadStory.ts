import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';

import { fetchGET } from './core/fetchGET';

export function useGetUnreadStory(roomUUID: string) {
  const path = `/getUnreadStory/${roomUUID}`;

  const { getAccessTokenSilently } = useAuth0();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();

    return fetchGET<number>({
      path,
      token
    });
  };

  const query = useQuery({
    queryKey: ['getUnreadStory', roomUUID],
    queryFn
  });

  return query;
}
