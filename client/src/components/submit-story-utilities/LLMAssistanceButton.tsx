import { Bot } from 'lucide-react';

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

  const { mutate: callLLMSupport } = useGenerateText();

  const handleLLMSupport = () => {
    setGeneratingStatus();
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
