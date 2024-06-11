import { useAuth0 } from '@auth0/auth0-react';
import { ApiGenerateTextPayload, GenerateTextBody } from '@quasm/common';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useStoryChunkStore } from '../stores/storyChunkStore';
import { fetchPOST } from './core/fetchPOST';

export function useGenerateText(
  onSuccess?: (text: string) => void | Promise<void>
) {
  const path = `/generateText`;

  const { getAccessTokenSilently } = useAuth0();

  const mutationFn = async (body: GenerateTextBody) => {
    const token = await getAccessTokenSilently();

    return fetchPOST<ApiGenerateTextPayload, GenerateTextBody>({
      path,
      body,
      token
    });
  };

  const setStoryWithLLM = useStoryChunkStore(state => state.setNewStoryWithLLM);

  return useMutation({
    mutationFn,
    onSuccess: async ({ generatedText }) => {
      setStoryWithLLM(generatedText);
      if (onSuccess) await onSuccess(generatedText);
    },
    onError: err => {
      toast.error(err.message);
    }
  });
}
