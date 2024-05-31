import { UUID } from 'crypto';

import { INotifierRepository } from '@/repositories/notifier/INotifierRepository';

import { Chatter } from '../chat/ChatMessage';

export class NotifierComponent {
    constructor(
        private readonly notifierRepository: INotifierRepository,
        readonly roomID: UUID
    ) {}

    async markStoryAsRead({
        chunkID,
        characterID
    }: {
        chunkID: number;
        characterID: UUID;
    }) {
        await this.notifierRepository.markStoryAsRead({
            chunkID,
            characterID
        });
    }

    async markMessageAsRead({
        messageID,
        characterID,
        senderID
    }: {
        messageID: number;
        characterID: UUID;
        senderID: Chatter;
    }) {
        await this.notifierRepository.markMessageAsRead({
            messageID,
            characterID,
            senderID
        });
    }

    async getNumberOfUnreadMessages(characterID: UUID) {
        return this.notifierRepository.countUnreadMessages(
            characterID,
            this.roomID
        );
    }

    async getNumberOfUnreadStoryChunks(characterID: UUID) {
        return this.notifierRepository.countUnreadStoryChunks(
            characterID,
            this.roomID
        );
    }
}
