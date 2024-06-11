import { useAuth0 } from '@auth0/auth0-react';
import { ApiMessagePayload, ErrorCode } from '@quasm/common';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import shortUUID from 'short-uuid';

import { useErrorToast } from '../misc/errorToast';
import { fetchGET } from './core/fetchGET';

interface QueryContext {
  pageParam: number | undefined;
}

const RANGE_COUNT = 25;

export function useFetchMessages(roomUUID: string, other: string) {
  const receiverUrl = other === 'broadcast' ? '' : `&other=${other}`;
  const path = `/fetchMessages/${roomUUID}?count=${RANGE_COUNT}${receiverUrl}`;

  const { getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const queryFn = async ({ pageParam }: QueryContext) => {
    const token = await getAccessTokenSilently();

    const offsetString = pageParam ? `&offset=${pageParam}` : '';

    console.log('refetch', pageParam);

    const result = await fetchGET<ApiMessagePayload[]>({
      path: `${path}${offsetString}`,
      token,
      onError: async code => {
        if (code === ErrorCode.MissingChat) {
          await navigate({
            to: '/room/$roomId',
            params: { roomId: shortUUID().fromUUID(roomUUID) }
          });
        }
      }
    });

    const currentUnreadMessages = queryClient.getQueryData<
      Record<string, number>
    >(['getUnreadMessages', roomUUID]);

    queryClient.setQueryData(['getUnreadMessages', roomUUID], {
      ...currentUnreadMessages,
      [other]: 0
    });

    return result;
  };

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['fetchMessages', roomUUID, other],
    queryFn,
    initialPageParam: undefined,
    getNextPageParam: lastPage =>
      lastPage.length === 0 ? undefined : lastPage[0].id
  });

  useErrorToast(infiniteQuery.isError, infiniteQuery.error?.message);

  return infiniteQuery;
}
