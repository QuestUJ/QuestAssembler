import { useEffect, useRef } from 'react';

interface StoryChunkDetails {
  id: number;
  content: string;
  imageURL?: string;
}

export function StoryChunk({ storyChunk }: { storyChunk: StoryChunkDetails }) {
  const { content, imageURL } = storyChunk;
  return (
    <div className='flex min-h-10 flex-col gap-4'>
      <p className='text-md rounded-md bg-background p-4'>{content}</p>
      {imageURL && (
        <img
          className='aspect-square max-h-96 max-w-96 self-center rounded-md'
          src={imageURL}
        />
      )}
    </div>
  );
}

export function StoryChunkContainer({ story }: { story: StoryChunkDetails[] }) {
  const scrollToRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    scrollToRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [scrollToRef, story]);

  return (
    <div className='flex flex-col gap-4'>
      {story.map(storyChunk => (
        <StoryChunk key={storyChunk.id} storyChunk={storyChunk} />
      ))}
      <span ref={scrollToRef}></span>
      <hr className='border-primary' />
    </div>
  );
}