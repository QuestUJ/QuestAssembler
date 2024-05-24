export class PlayerTurnSubmit {
    constructor(
        readonly content: string,
        readonly timestamp: Date
    ) {}

    length() {
        return this.content.length;
    }
}
