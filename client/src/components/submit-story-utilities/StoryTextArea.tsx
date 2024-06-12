import { RotateCcw } from 'lucide-react';

import { useStoryChunkStore } from '@/lib/stores/storyChunkStore';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

export function StoryTextArea() {
  const setStory = useStoryChunkStore(state => state.setStory);
  const story = useStoryChunkStore(state => state.story);
  const oldStory = useStoryChunkStore(state => state.oldStory);
  const revertStory = useStoryChunkStore(state => state.revertStory);

  return (
    <div className='relative lg:h-full lg:w-full'>
      <Textarea
        placeholder='Type your story here...'
        value={story}
        onChange={e => setStory(e.target.value)}
        className='min-h-60 lg:h-full lg:w-full'
      />
      {oldStory ? (
        <Button
          className='absolute bottom-2 right-2 h-10 w-10 p-2 lg:bottom-1 lg:right-1'
          onClick={revertStory}
        >
          <RotateCcw className='h-full w-full' />
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
