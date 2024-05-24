import { ICharacterRepository } from './character/ICharacterRepository';
import { IChatRepository } from './chat/IChatRepository';
import { IRoomRepository } from './room/IRoomRepository';
import { IStoryRepository } from './story/IStoryRepository';

export class DataAccessFacade {
    constructor(
        readonly roomRepository: IRoomRepository,
        readonly characterRepository: ICharacterRepository,
        readonly chatRepository: IChatRepository,
        readonly storyRepository: IStoryRepository
    ) {}
}
