export interface IQuasmEventEmitter<EventMap> {
    on<T extends keyof EventMap>(
        event: T,
        handler: (payload: EventMap[T]) => void | Promise<void>
    ): void;
}
