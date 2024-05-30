import { useAuth0 } from '@auth0/auth0-react';
import { ApiStoryChunk } from '@quasm/common';
import { useQuery } from '@tanstack/react-query';

import { useErrorToast } from '../misc/errorToast';
import { fetchGET } from './core/fetchGET';

export function useFetchStory(roomUUID: string) {
  const path = `/fetchStory/${roomUUID}`;

  const { getAccessTokenSilently } = useAuth0();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();
    return fetchGET<ApiStoryChunk[]>({
      path,
      token
    });
  };

  const query = useQuery({
    queryKey: ['fetchStory', roomUUID],
    queryFn
  });

  useErrorToast(query.isError, query.error?.message);

  console.log(query);

  return query;
}
