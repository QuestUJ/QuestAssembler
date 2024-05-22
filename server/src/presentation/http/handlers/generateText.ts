import {
    GenerateTextBody,
    GenerateTextResponse,
    QuasmComponent
} from '@quasm/common';
import { FastifyInstance } from 'fastify';

import { IAIAssistant } from '@/domain/tools/ai-assistant/IAIAssistant';
import { logger } from '@/infrastructure/logger/Logger';

export function addGenerateTextHandler(
    fastify: FastifyInstance,
    aiAssistant: IAIAssistant
) {
    // decided it should be a POST request because i want the access to request body
    // url params would not handle long prompts
    // method may be changed to fit better later
    fastify.post<{
        Reply: GenerateTextResponse;
        Body: GenerateTextBody;
    }>('/generateText', async (request, reply) => {
        logger.info(
            QuasmComponent.HTTP,
            `${request.user.userID} | POST /generateText RECEIVED ${JSON.stringify(request.body)}`
        );

        // TODO: Validate if user is a game master

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

        logger.info(
            QuasmComponent.HTTP,
            `${request.user.userID} | POST /generateText SUCCESS ${JSON.stringify(request.body)}`
        );
    });
}
