import { useAuth0 } from '@auth0/auth0-react';
import { ApiStoryChunk } from '@quasm/common';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useErrorToast } from '../misc/errorToast';
import { fetchGET } from './core/fetchGET';

export function useFetchStory(roomUUID: string) {
  const path = `/fetchStory/${roomUUID}`;

  const { getAccessTokenSilently } = useAuth0();

  const queryClient = useQueryClient();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();
    const result = await fetchGET<ApiStoryChunk[]>({
      path,
      token
    });

    queryClient.setQueryData<number>(['getUnreadStory', roomUUID], 0);

    return result;
  };

  const query = useQuery({
    queryKey: ['fetchStory', roomUUID],
    queryFn
  });

  useErrorToast(query.isError, query.error?.message);

  return query;
}
