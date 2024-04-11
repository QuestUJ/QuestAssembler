export interface IAIAssistant {
    getImage(prompt: string): string;
    getText(prompt: string): string;
}
