/**
 * Interfaces for communication between server and client
 */

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

export interface ChunkRange {
    offset: number | undefined; // id of the last message/chunk we have (will return ones before it) or undefined when we just want `count` of the last messages/chunks
    count: number; // how many messages/chunks we want
}
