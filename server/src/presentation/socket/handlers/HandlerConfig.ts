import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { QuasmSocket, QuasmSocketServer } from '../socketServer';

export interface HandlerConfig {
    io: QuasmSocketServer;
    socket: QuasmSocket;
    dataAccess: DataAccessFacade;
    authProvider: IAuthProvider;
}
