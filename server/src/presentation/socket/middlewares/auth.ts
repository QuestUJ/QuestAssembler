import { ErrorCode, QuasmError } from '@quasm/common';
import { QuasmComponent } from '@quasm/common';

import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';

import { QuasmSocket } from '../socketServer';

export function auth(authProvider: IAuthProvider) {
    return (socket: QuasmSocket, next: (e?: Error) => void) => {
        const { token } = socket.handshake.auth;

        if (!token || typeof token !== 'string') {
            next(
                new QuasmError(
                    QuasmComponent.AUTH,
                    401,
                    ErrorCode.MissingAccessToken,
                    `token: ${token}`
                )
            );

            return;
        }

        authProvider
            .verify(token)
            .then(id => {
                socket.data.userID = id;
                socket.data.token = token;
                next();
            })
            .catch((e: Error) => next(e));
    };
}
