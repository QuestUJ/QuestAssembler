import { GenerateTextBody, GenerateTextResponse } from '@quasm/common';
import { FastifyInstance } from 'fastify';

import { IAIAssistant } from '@/domain/tools/ai-assistant/IAIAssistant';

export function addGenerateTextHandler(
    fastify: FastifyInstance,
    aiAssistant: IAIAssistant
) {
    fastify.post<{
        Reply: GenerateTextResponse;
        Body: GenerateTextBody;
    }>('/generateText', async (request, reply) => {
        const { prompt } = request.body as {
            prompt: string;
        };

        const LLMText = await aiAssistant.getText(prompt);

        await reply.send({
            success: true,
            payload: {
                generatedText: LLMText
            }
        });
    });
}
