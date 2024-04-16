export class PlayerTurnSubmit {
    content: string = '';
    readonly timestamp: Date = new Date();

    constructor(content: string) {
        this.content = content;
    }
}
