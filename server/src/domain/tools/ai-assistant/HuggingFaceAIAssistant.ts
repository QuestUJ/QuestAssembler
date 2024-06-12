import { ErrorCode, QuasmComponent, QuasmError } from '@quasm/common';

import { config } from '@/config';

import { IAIAssistant } from './IAIAssistant';

type HuggingFaceAPIResponse = {
    generated_text: string;
}[];

const { LLM_URL } = config.pick(['LLM_URL']);

/**
 * Simple HuggingFace client
 */
export class HuggingFaceAiAssistant implements IAIAssistant {
    private token;
    private PROMPT_PREFIX =
        'Rewrite the following chapter to transform it into an engaging, detailed, and immersive narrative. Focus on enhancing the descriptions, developing the characters, and creating a vivid and compelling scene. Make sure to incorporate sensory details, emotions, and a sense of journey or discovery. It should be very long. Make sure the rewritten story captures the essence of the original but with added depth, emotion, and vivid imagery. The aim is to engage the reader and make them feel connected to the character and their journey. You have to add a lot of words. You can include fantastic events and characters. Story to rewrite:\n';
    /**
     * @param hgToken huggingface access token (it is not required but without huggingface is blocking requests almost imediately)
     */
    constructor(hgToken: string) {
        this.token = hgToken;
    }

    async getImage(prompt: string): Promise<Buffer> {
        prompt;
        await new Promise(resolve => {
            resolve('');
        });
        return Buffer.from([0]);
    }

    private processString(text: string) {
        const slicedText = text.slice(this.PROMPT_PREFIX.length); // reply will involve the prompt
        const assistantStrippedText = slicedText.replaceAll(
            '<|assistant|>',
            ''
        );
        const userStrippedText = assistantStrippedText.replaceAll(
            '<|user|>',
            ''
        );
        return userStrippedText;
    }

    async getText(prompt: string): Promise<string> {
        return fetch(LLM_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: this.PROMPT_PREFIX + prompt
            })
        })
            .then(res => res.json())
            .then((res: HuggingFaceAPIResponse) => {
                if (!(res instanceof Array)) {
                    throw new QuasmError(
                        QuasmComponent.AI,
                        500,
                        ErrorCode.Unexpected,
                        JSON.stringify(res)
                    );
                }

                return this.processString(res[0].generated_text);
            });
    }
}
