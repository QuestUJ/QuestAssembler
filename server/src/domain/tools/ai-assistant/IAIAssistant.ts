export interface IAIAssistant {
    getImage(prompt: string): Promise<Buffer>;
    getText(prompt: string): Promise<string>;
}
