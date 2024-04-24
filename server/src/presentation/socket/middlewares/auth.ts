import { ErrorLocation, QuasmError } from '@quasm/common';

import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';

import { QuasmSocket } from '../socketServer';

export function auth(authProvider: IAuthProvider) {
    return (socket: QuasmSocket, next: (e?: Error) => void) => {
        const { token } = socket.handshake.auth;

        if (!token || typeof token !== 'string') {
            next(
                new QuasmError(
                    ErrorLocation.AUTH,
                    401,
                    'Unauthorized missing token'
                )
            );
        }

        authProvider
            .verify(token as string)
            .then(details => {
                socket.data.user = details;
                next();
            })
            .catch((e: Error) => next(e));
    };
}
