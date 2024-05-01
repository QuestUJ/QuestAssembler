export type DisplayMessage = {
  type: 'Message';
  authorName: string;
  characterPictureURL: string | undefined;
  messageTimeStamp: Date;
  messageContent: string;
};

export type DisplayStoryChunk = {
  type: 'StoryChunk';
  contents: string;
  imageURL: string | undefined;
};

export type MessageTypes = DisplayMessage | DisplayStoryChunk;

export function Message({ message }: { message: DisplayMessage }) {
  return (
    <div className='m-1 my-3 flex min-h-10 w-full'>
      <img
        src={message.characterPictureURL}
        className='aspect-square h-full max-h-10 rounded-full'
      />
      <div className='mx-2 w-full'>
        <div className='flex flex-nowrap items-center'>
          <h1 className='text-md mr-2 text-primary'>{message.authorName}</h1>
          <h3 className='pt-1 text-xs text-secondary'>
            {message.messageTimeStamp.toDateString()}
          </h3>
        </div>
        <p className='text-xs'>{message.messageContent}</p>
      </div>
    </div>
  );
}

export function StoryChunk({ storyChunk }: { storyChunk: DisplayStoryChunk }) {
  return (
    <div className='m-1 my-3 flex min-h-10 flex-col'>
      <p className='text-sm'>{storyChunk.contents}</p>
      {storyChunk.imageURL ? (
        <img className='m-1 aspect-square w-40' src={storyChunk.imageURL} />
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
          if (message.type === 'Message') {
            return <Message message={message} />;
          } else {
            return <StoryChunk storyChunk={message} />;
          }
        })}
      </div>
    </div>
  );
}
