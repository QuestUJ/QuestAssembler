import { IAuthProvider } from '@/domain/tools/auth-provider/IAuthProvider';
import { IFileStorage } from '@/domain/tools/file-storage/IFileStorage';
import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { QuasmSocket, QuasmSocketServer } from '../socketServer';

export interface HandlerConfig {
    io: QuasmSocketServer;
    socket: QuasmSocket;
    dataAccess: DataAccessFacade;
    authProvider: IAuthProvider;
    fileStorageProvider: IFileStorage;
}
