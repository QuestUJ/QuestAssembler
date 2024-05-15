// export class StoryRepositoryPostgres implements IStoryRepository {
//     constructor(private db: Kysely<Database>) {}
//
//     fetchStoryChunks(
//         roomID: string,
//         range: ChunkRange
//     ): Promise<StoryChunk[]> {}
//
//     async setPlayerTurnSubmit(
//         id: UUID,
//         submit: PlayerTurnSubmit
//     ): Promise<void> {
//         await this.db
//             .updateTable('Characters')
//             .set(submit)
//             .where('id', '=', id)
//             .execute();
//     }
//
//     async addStoryChunk(roomID: UUID, chunk: StoryChunk): Promise<StoryChunk> {
//         await this.db
//             .insertInto('StoryChunks')
//             .values({
//                 roomID: roomID,
//                 title: chunk.title,
//                 content: chunk.content,
//                 imageURL: chunk.imageUrl
//             })
//             .executeTakeFirstOrThrow();
//         return chunk;
//     }
//
//     async fetchStory(roomID: UUID, range: ChunkRange): Promise<StoryChunk[]> {
//         if (typeof range.offset == 'undefined')
//             range.offset = DEFAULT_FETCHED_STORYCHUNKS;
//
//         const lowerBound = range.offset - range.count + 1;
//         const upperBound = range.offset;
//
//         const storyChunkData = await this.db
//             .selectFrom('StoryChunks')
//             .where('roomID', '=', roomID)
//             .where('id', '>=', lowerBound)
//             .where('id', '<=', upperBound)
//             .selectAll()
//             .execute();
//
//         storyChunkData.forEach(r => {
//             this.fetchedRooms.delete(r.chunkID as unknown as UUID);
//         });
//
//         const result: StoryChunk[] = [];
//
//         storyChunkData.forEach(r => {
//             if (!this.fetchedRooms.has(r.chunkID as unknown as UUID)) {
//                 const chunk = new StoryChunk(
//                     r.chunkID,
//                     r.title,
//                     r.content,
//                     r.imageURL,
//                     r.timestamp
//                 );
//                 this.fetchedStoryChunks.set(
//                     r.chunkID as unknown as UUID,
//                     chunk
//                 );
//                 result.push(chunk);
//             }
//         });
//         return result;
//     }
// }
