export interface ChunkRange {
    offset?: number; // id of last received message, or undefined if we want the most fresh ones
    count: number; // How many next messages
}
