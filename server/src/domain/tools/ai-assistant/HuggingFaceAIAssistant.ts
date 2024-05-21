import { HfInference } from '@huggingface/inference';

import { IAIAssistant } from './IAIAssistant';
/**
 * Simple HuggingFace client
 */
export class HuggingFaceAiAssistant implements IAIAssistant {
    private hfApiService;
    /**
     * @param hgToken huggingface access token (it is not required but without huggingface is blocking requests almost imediately)
     */
    constructor(hgToken: string) {
        this.hfApiService = new HfInference(hgToken);
    }

    async getImage(prompt: string): Promise<Buffer> {
        prompt;
        await new Promise(resolve => {
            resolve('');
        });
        return Buffer.from([0]);
    }

    async getText(prompt: string): Promise<string> {
        return this.hfApiService
            .textGeneration({
                model: 'gpt2',
                inputs: prompt,
                max_new_tokens: 250, // maximum for text generation
                max_length: 500
            })
            .then(value => value.generated_text);
    }
}
