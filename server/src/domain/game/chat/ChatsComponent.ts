import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { AsyncEventEmitter } from '@/domain/core/AsyncEventEmitter';
import { IQuasmEventEmitter } from '@/domain/core/IQuasmEventEmitter';
import { IChatRepository } from '@/repositories/chat/IChatRepository';

import { CharactersComponent } from '../character/CharactersComponent';
import { Chat } from './Chat';
import { ChatMessage, ChatParticipants } from './ChatMessage';

export interface ChatsEventMap {
    newMessage: (message: ChatMessage) => void;
}

export class ChatsComponent implements IQuasmEventEmitter<ChatsEventMap> {
    private broadcast: Chat;
    private chats: Map<string, Chat>;
    private emitter: AsyncEventEmitter<ChatsEventMap>;

    constructor(
        private chatRepository: IChatRepository,
        private roomID: UUID,
        private charactersComponent: CharactersComponent
    ) {
        this.emitter = new AsyncEventEmitter();

        this.broadcast = new Chat(
            this.chatRepository,
            'broadcast',
            this.roomID,
            this.emitter
        );
        this.chats = new Map();

        this.charactersComponent.on('playerJoined', character => {
            this.addChat(character.id);
        });
        this.charactersComponent.on('playerLeft', character => {
            this.removeChats(character.id);
        });
    }

    on<T extends 'newMessage'>(event: T, handler: ChatsEventMap[T]): void {
        this.emitter.on(event, handler);
    }

    /**
     * Helper method for respawning chats, typically called after raeding from db for example
     */
    spawnChats() {
        const characters = this.charactersComponent.getCharacters();

        for (let i = 0; i < characters.length; i++) {
            for (let j = i + 1; j < characters.length; j++) {
                const chat = new Chat(
                    this.chatRepository,
                    [characters[i].id, characters[j].id],
                    this.roomID,
                    this.emitter
                );
                this.chats.set(JSON.stringify(chat.chatters), chat);
            }
        }

        this.broadcast = new Chat(
            this.chatRepository,
            'broadcast',
            this.roomID,
            this.emitter
        );
    }

    addChat(characterID: UUID) {
        const characters = this.charactersComponent.getCharacters();
        characters.forEach(other => {
            const chat = new Chat(
                this.chatRepository,
                [other.id, characterID],
                this.roomID,
                this.emitter
            );
            this.chats.set(JSON.stringify(chat.chatters), chat);
        });
    }

    getBroadcast(): Chat {
        return this.broadcast;
    }

    getPrivateChats() {
        return [...this.chats.values()];
    }

    getPrivateChatsOfCharacter(characterId: UUID) {
        return [...this.chats.values()].filter(
            ({ chatters: [p1, p2] }) => p1 == characterId || p2 == characterId
        );
    }

    getChat(participants: ChatParticipants): Chat {
        if (participants === 'broadcast') {
            return this.broadcast;
        }
        const chat = this.chats.get(JSON.stringify(Chat.toId(participants)));

        if (!chat) {
            throw new QuasmError(
                QuasmComponent.CHAT,
                500,
                ErrorCode.MissingChat,
                participants.join(',')
            );
        }

        return chat;
    }

    removeChats(characterId: UUID): void {
        const characters = this.charactersComponent.getCharacters();
        characters.forEach(other => {
            this.chats.delete(
                JSON.stringify(Chat.toId([characterId, other.id]))
            );
        });
    }
}
