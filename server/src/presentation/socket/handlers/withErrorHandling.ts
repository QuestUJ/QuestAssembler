import { Ack, ErrorMap, QuasmError } from '@quasm/common';

import { logger } from '@/infrastructure/logger/Logger';

export function withErrorHandling<T>(
    respond: (res: Ack<T>) => void,
    handler: () => void | Promise<void>
) {
    const err = (error: unknown) => {
        if (error instanceof QuasmError) {
            logger.error(
                error.errorLocation,
                `ErrorCode: ${error.errorCode}, Context: ${error.message}`
            );

            respond({
                error: ErrorMap[error.errorCode],
                success: false
            });
        } else {
            console.log(error);
            respond({
                success: false,
                error: 'Unexpected error!'
            });
        }
    };

    try {
        const result = handler();
        if (result instanceof Promise) {
            result.catch(err);
        }
    } catch (e) {
        err(e);
    }
}
