import { ICharacterRepository } from './character/ICharacterRepository';
import { IChatRepository } from './chat/IChatRepository';
import { IRoomRepository } from './room/IRoomRepository';

export class DataAccessFacade {
    constructor(
        readonly roomRepository: IRoomRepository,
        readonly characterRepository: ICharacterRepository,
        readonly chatRepository: IChatRepository
    ) {}
}
