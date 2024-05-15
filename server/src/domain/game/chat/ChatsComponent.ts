import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';
import { UUID } from 'crypto';

import { IChatRepository } from '@/repositories/chat/IChatRepository';

import { CharactersComponent } from '../character/CharactersComponent';
import { Chat } from './Chat';
import { ChatMessage, ChatParticipants } from './ChatMessage';

export class ChatsComponent {
    private broadcast: Chat;
    private chats: Map<string, Chat>;

    constructor(
        private chatRepository: IChatRepository,
        private roomID: UUID,
        private charactersComponent: CharactersComponent
    ) {
        this.broadcast = new Chat(
            this.chatRepository,
            'broadcast',
            this.roomID
        );
        this.chats = new Map();

        this.charactersComponent.onCharacterJoin(character => {
            this.addChat(character.id);
        });
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
                    this.roomID
                );
                this.chats.set(JSON.stringify(chat.chatters), chat);
            }
        }

        this.broadcast = new Chat(
            this.chatRepository,
            'broadcast',
            this.roomID
        );
    }

    addChat(characterID: UUID) {
        const characters = this.charactersComponent.getCharacters();
        characters.forEach(other => {
            const chat = new Chat(
                this.chatRepository,
                [other.id, characterID],
                this.roomID
            );
            this.chats.set(JSON.stringify(chat.chatters), chat);
        });
    }

    getBroadcast(): Chat {
        return this.broadcast;
    }

    async addBrodcastMessage(message: ChatMessage): Promise<void> {
        await this.broadcast.addMessage(message);
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
}
