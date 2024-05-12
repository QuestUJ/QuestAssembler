import {
    ChunkRange,
    ErrorCode,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';

import { IRoomRepository } from '@/repositories/room/IRoomRepository';

import {
    ChatMessage,
    ChatMessageDetails,
    ChatParticipants
} from './ChatMessage';

const MAX_CHAT_MESSAGES: number = 500;
const MAX_CHAT_MESSAGE_LENGTH: number = 280;

export class Chat {
    readonly chatters: ChatParticipants;

    constructor(
        private readonly roomRepository: IRoomRepository,
        chatters: ChatParticipants,
        readonly roomID: UUID
    ) {
        if (chatters === 'broadcast') {
            this.chatters = chatters;
        } else {
            this.chatters = Chat.toId(chatters);
        }
    }

    /**
     * Returns id of chat wich specified participans
     */
    static toId(chatters: [UUID, UUID]): [UUID, UUID] {
        const [c1, c2] = chatters;
        if (c1 < c2) {
            return [c1, c2];
        }

        return [c2, c1];
    }

    async addMessage(
        chatMessageDetails: ChatMessageDetails
    ): Promise<ChatMessage> {
        const count = await this.roomRepository.fetchMessageCount(
            this.chatters,
            this.roomID
        );
        if (count === MAX_CHAT_MESSAGES) {
            throw new QuasmError(
                QuasmComponent.CHAT,
                400,
                ErrorCode.MessagesLimit,
                `Limit: ${MAX_CHAT_MESSAGES}`
            );
        }

        if (chatMessageDetails.content.length > MAX_CHAT_MESSAGE_LENGTH) {
            throw new QuasmError(
                QuasmComponent.CHAT,
                400,
                ErrorCode.MessageLength,
                `Limit: ${MAX_CHAT_MESSAGE_LENGTH}`
            );
        }

        return this.roomRepository.addMessage(chatMessageDetails);
    }

    async fetchMessages(range: ChunkRange): Promise<ChatMessage[]> {
        const fetchedMessages = await this.roomRepository.fetchMessages(
            this.chatters,
            range
        );

        return fetchedMessages;
    }
}
