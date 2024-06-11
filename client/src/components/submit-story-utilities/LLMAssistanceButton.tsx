import { Bot } from 'lucide-react';
import { useEffect } from 'react';

import { useGenerateText } from '@/lib/api/generateText';
import { useStoryChunkStore } from '@/lib/stores/storyChunkStore';

import { Button } from '../ui/button';

export function LLMAssistanceButton() {
  const story = useStoryChunkStore(state => state.story);
  const setGeneratingStatus = useStoryChunkStore(
    state => state.setGeneratingStatus
  );
  const isGeneratingWithLLM = useStoryChunkStore(
    state => state.isGeneratingWithLLM
  );

  const { mutate: callLLMSupport, isError } = useGenerateText();

  useEffect(() => {
    if (isError) {
      setGeneratingStatus(false);
    }
  }, [isError, setGeneratingStatus]);

  const handleLLMSupport = () => {
    setGeneratingStatus(true);
    callLLMSupport({
      prompt: story
    });
  };

  return (
    <Button
      className='flex w-full items-center gap-2 bg-white p-2 text-xs'
      onClick={handleLLMSupport}
      disabled={isGeneratingWithLLM}
    >
      {isGeneratingWithLLM ? (
        <>Generating...</>
      ) : (
        <>
          <Bot className='' />
          Rewrite with LLM
        </>
      )}
    </Button>
  );
}
