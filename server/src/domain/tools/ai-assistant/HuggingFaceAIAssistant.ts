import { IAIAssistant } from './IAIAssistant';

type HuggingFaceAPIResponse = {
    generated_text: string;
}[];

/**
 * Simple HuggingFace client
 */
export class HuggingFaceAiAssistant implements IAIAssistant {
    private token;
    private PROMPT_PREFIX =
        'Can you please finish the story? It should be very long. You have to add a lot of words. ';
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
        return fetch(
            'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: this.PROMPT_PREFIX + prompt
                })
            }
        )
            .then(res => res.json())
            .then((res: HuggingFaceAPIResponse) =>
                this.processString(res[0].generated_text)
            );
    }
}
