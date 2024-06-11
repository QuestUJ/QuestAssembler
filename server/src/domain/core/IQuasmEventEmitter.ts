export interface IQuasmEventEmitter<EventMap> {
    on<T extends keyof EventMap>(event: T, handler: EventMap[T]): void;
}
