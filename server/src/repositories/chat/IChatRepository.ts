import { UUID } from 'crypto';

import { ChatMessage } from '@/domain/game/ChatMessage';

export interface IChatRepository {
    createMessage(content: string): ChatMessage;
    fetchMessages(chatID: UUID): ChatMessage[];
}
