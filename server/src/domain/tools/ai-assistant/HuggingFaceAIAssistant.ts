import { IAIAssistant } from './IAIAssistant';

/**
 * Simple HuggingFace client
 */
export class HuggingFaceAiAssistant implements IAIAssistant {
    /**
     * @param hgToken huggingface access token (it is not required but without huggingface is blocking requests almost imediately)
     */
    constructor(hgToken: string) {
        hgToken;
    }

    async getImage(prompt: string): Promise<Buffer> {
        prompt;
        await new Promise(resolve => {
            resolve('');
        });
        return Buffer.from([0]);
    }

    async getText(prompt: string): Promise<string> {
        prompt;
        await new Promise(resolve => {
            resolve('');
        });
        return '';
    }
}
