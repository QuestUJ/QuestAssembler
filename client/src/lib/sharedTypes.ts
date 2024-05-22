// type is needed for deciding how to render a message
export type MessageDetails = {
  type: 'message';
  authorName: string;
  characterPictureURL: string | undefined;
  timestamp: Date;
  content: string;
};

export type StoryChunkDetails = {
  type: 'storychunk';
  contents: string;
  imageURL: string | undefined;
};

export type MessageTypes = MessageDetails | StoryChunkDetails;
