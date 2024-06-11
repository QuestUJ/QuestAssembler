import { Ack, ErrorCode, ErrorMap, QuasmError } from '@quasm/common';

import { logger } from '@/infrastructure/logger/Logger';

export function withErrorHandling<T>(
    handler: () => void | Promise<void>,
    respond?: (res: Ack<T>) => void
) {
    const err = (error: unknown) => {
        if (error instanceof QuasmError) {
            logger.error(error.errorLocation, [
                `ErrorCode: ${error.errorCode}, Context: ${error.message}`
            ]);

            if (respond) {
                respond({
                    error: {
                        code: error.errorCode,
                        message: ErrorMap[error.errorCode]
                    },
                    success: false
                });
            }
        } else {
            console.log(error);
            if (respond) {
                respond({
                    success: false,
                    error: {
                        code: ErrorCode.Unexpected,
                        message: ErrorMap[ErrorCode.Unexpected]
                    }
                });
            }
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
