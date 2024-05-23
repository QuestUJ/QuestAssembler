export class AsyncEventEmitter<EventMap> {
    private eventMap: Map<
        keyof EventMap,
        ((payload: unknown) => void | Promise<void>)[]
    >;

    constructor() {
        this.eventMap = new Map();
    }

    on<T extends keyof EventMap>(event: T, handler: EventMap[T]) {
        if (!this.eventMap.has(event)) {
            this.eventMap.set(event, []);
        }

        this.eventMap
            .get(event)!
            .push(handler as (payload: unknown) => void | Promise<void>);
    }

    async emit<T extends keyof EventMap>(
        event: T,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payload: EventMap[T] extends (...args: any[]) => void | Promise<void>
            ? Parameters<EventMap[T]>[0]
            : never
    ) {
        if (!this.eventMap.has(event)) return;

        const promises = this.eventMap
            .get(event)!
            .map(f => f(payload))
            .filter(r => r instanceof Promise);

        await Promise.all(promises);
    }
}
