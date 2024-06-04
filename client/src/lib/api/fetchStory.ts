import { useAuth0 } from '@auth0/auth0-react';
import { ApiStoryChunk } from '@quasm/common';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { useErrorToast } from '../misc/errorToast';
import { fetchGET } from './core/fetchGET';

interface QueryContext {
  pageParam: number | undefined;
}

const RANGE_COUNT = 25;

export function useFetchStory(roomUUID: string) {
  const path = `/fetchStory/${roomUUID}?count=${RANGE_COUNT}`;

  const { getAccessTokenSilently } = useAuth0();

  const queryClient = useQueryClient();

  const queryFn = async ({ pageParam }: QueryContext) => {
    const token = await getAccessTokenSilently();

    const offsetString = pageParam ? `&offset=${pageParam}` : '';

    const result = await fetchGET<ApiStoryChunk[]>({
      path: `${path}${offsetString}`,
      token
    });

    queryClient.setQueryData<number>(['getUnreadStory', roomUUID], 0);

    return result;
  };

  const query = useInfiniteQuery({
    queryKey: ['fetchStory', roomUUID],
    queryFn,
    initialPageParam: undefined,
    getNextPageParam: lastPage =>
      lastPage.length === 0 ? undefined : lastPage[0].id
  });

  useErrorToast(query.isError, query.error?.message);

  return query;
}
