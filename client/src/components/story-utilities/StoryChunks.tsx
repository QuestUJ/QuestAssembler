import { ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

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
          className='aspect-square h-full max-h-56 w-full max-w-56 self-center rounded-md'
          src={imageURL}
        />
      )}
    </div>
  );
}

interface StoryChunksProps {
  story: StoryChunkDetails[][];
  fetchMore: () => void;
  hasMore: boolean;
  loader: ReactNode;
  containerID: string;
}

export function StoryChunkContainer({
  story,
  fetchMore,
  hasMore,
  loader,
  containerID
}: StoryChunksProps) {
  return (
    <InfiniteScroll
      className='flex flex-col-reverse gap-4 p-8'
      inverse={true}
      dataLength={story.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={loader}
      scrollableTarget={containerID}
    >
      {story.map(page =>
        page.map(chunk => <StoryChunk key={chunk.id} storyChunk={chunk} />)
      )}
    </InfiniteScroll>
  );
}
