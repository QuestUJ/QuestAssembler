import { useAuth0 } from '@auth0/auth0-react';
import { ApiMessagePayload, ErrorCode } from '@quasm/common';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import shortUUID from 'short-uuid';

import { useErrorToast } from '../misc/errorToast';
import { fetchGET } from './core/fetchGET';

export function useFetchMessages(roomUUID: string, other: string) {
  const receiverUrl = other === 'broadcast' ? '' : `?other=${other}`;
  const path = `/fetchMessages/${roomUUID}${receiverUrl}`;

  const { getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();

  const queryFn = async () => {
    const token = await getAccessTokenSilently();
    return fetchGET<ApiMessagePayload[]>({
      path,
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
  };

  const query = useQuery({
    queryKey: ['fetchMessages', roomUUID, other],
    queryFn
  });

  useErrorToast(query.isError, query.error?.message);

  return query;
}
