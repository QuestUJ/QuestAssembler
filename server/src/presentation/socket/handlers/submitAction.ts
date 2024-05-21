import { HandlerConfig } from './HandlerConfig';

export function submitActionHandler({ socket }: HandlerConfig) {
    socket.on('submitAction', ({ content, roomID }) => {
        console.log(content, roomID);
    });
}
