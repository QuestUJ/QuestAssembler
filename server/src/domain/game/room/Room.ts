import { UUID } from 'crypto';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { CharactersComponent } from '../character/CharactersComponent';
import { ChatsComponent } from '../chat/ChatsComponent';
import { RoomSettings, RoomSettingsDetails } from './RoomSettings';

export class Room {
    readonly roomSettings: RoomSettings;
    readonly characters: CharactersComponent;
    readonly chats: ChatsComponent;

    constructor(
        private readonly dataAccess: DataAccessFacade,
        readonly id: UUID,
        roomSettings: RoomSettingsDetails
    ) {
        this.roomSettings = new RoomSettings(
            this.dataAccess.roomRepository,
            this.id,
            roomSettings.roomName,
            roomSettings.maxPlayerCount
        );

        this.characters = new CharactersComponent(
            this.dataAccess.characterRepository,
            this.id,
            this.roomSettings
        );

        this.chats = new ChatsComponent(
            this.dataAccess.chatRepository,
            this.id,
            this.characters
        );
    }
}
