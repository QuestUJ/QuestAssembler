import { IAIAssistant } from './IAIAssistant';

export class HuggingFaceAiAssistant implements IAIAssistant {
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
