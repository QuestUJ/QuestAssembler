import {
  MessageDetails,
  MessageTypes,
  StoryChunkDetails
} from '%/src/DataInterface';

export function Message({ message }: { message: MessageDetails }) {
  const { authorName, characterPictureURL, content, timestamp } = message;
  return (
    <div className='m-1 my-3 flex min-h-10 w-full'>
      <img
        src={characterPictureURL}
        className='aspect-square h-full max-h-10 rounded-full'
      />
      <div className='mx-2 w-full'>
        <div className='flex flex-nowrap items-center'>
          <h1 className='text-md mr-2 text-primary'>{authorName}</h1>
          <h3 className='pt-1 text-xs text-secondary'>
            {timestamp.toDateString()}
          </h3>
        </div>
        <p className='text-xs'>{content}</p>
      </div>
    </div>
  );
}

export function StoryChunk({ storyChunk }: { storyChunk: StoryChunkDetails }) {
  const { contents, imageURL } = storyChunk;
  return (
    <div className='m-1 my-3 flex min-h-10 flex-col'>
      <p className='text-sm'>{contents}</p>
      {imageURL ? (
        <img className='m-1 aspect-square w-40' src={imageURL} />
      ) : (
        <></>
      )}
    </div>
  );
}

export function MessageContainer({ messages }: { messages: MessageTypes[] }) {
  return (
    <div className='h-full overflow-y-auto p-3'>
      <div className='flex h-fit min-h-full flex-col'>
        {messages.map((message: MessageTypes) => {
          if (message.type === 'message') {
            return <Message message={message} />;
          } else {
            return <StoryChunk storyChunk={message} />;
          }
        })}
      </div>
    </div>
  );
}
