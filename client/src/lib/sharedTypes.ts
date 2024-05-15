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

export type TurnSubmitDetails = {
  content: string | undefined;
  timestamp: Date | undefined;
};

export type CharacterDetails = {
  pictureURL: string | undefined;
  name: string;
  turnSubmit: TurnSubmitDetails;
  id: number;
};

export type MessageTypes = MessageDetails | StoryChunkDetails;
