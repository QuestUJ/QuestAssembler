import { useAuth0 } from '@auth0/auth0-react';
import { ApiResponse } from '@quasm/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { config } from '@/config';

interface ApiCall {
  path: string;
  queryKey: string[];
}

const { API_BASE_URL } = config.pick(['API_BASE_URL']);

export function useApiGet<Payload>({ path, queryKey }: ApiCall) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error('NOT_AUTHENTICATED_ERROR');
      }

      const token = await getAccessTokenSilently();

      const response = (await fetch(`${API_BASE_URL}/api/v1${path}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: AbortSignal.timeout(10000)
      }).then(res => res.json())) as ApiResponse<Payload>;

      if (!response.success) {
        toast({
          variant: 'destructive',
          title: 'Somthing went wrong',
          description: 'fsdf ' + response.error?.message
        });

        throw new Error(response.error?.message);
      }

      return response.payload! as Payload;
    }
  });
}

interface PostApiCall<Res> {
  path: string;
  invalidate: string[];
  onSuccess: (res: Res) => void;
}

export function useApiPost<Payload, Body>({
  path,
  invalidate,
  onSuccess
}: PostApiCall<Payload>) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: Body) => {
      // auth related validation
      if (!isAuthenticated) {
        throw new Error('NOT_AUTHENTICATED_ERROR');
      }
      const token = await getAccessTokenSilently();

      // API call
      const response = (await fetch(`${API_BASE_URL}/api/v1${path}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000)
      }).then(res => res.json())) as ApiResponse<Payload>;

      // response handling
      if (!response.success) {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: response.error?.message
        });
        throw new Error(`Something went wrong ${response.error?.message}`);
      } else {
        onSuccess(response.payload! as Payload);

        await queryClient.invalidateQueries({ queryKey: invalidate });
      }

      return response.payload! as Payload;
    }
  });
}
