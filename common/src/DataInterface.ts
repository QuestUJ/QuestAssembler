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
    offset: number | undefined; // id of last received message, or undefined if we want the most fresh ones
    count: number; // How many next messages
}
