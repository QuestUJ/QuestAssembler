import { QuasmComponent } from '@quasm/common';

class Logger {
    private format(level: string, location: string, msg: string) {
        return `${new Date().toISOString()} | ${level} | ${location} | ${msg}`;
    }

    info(componentName: QuasmComponent, message: string) {
        console.log(this.format('INFO', componentName, message));
    }

    warning(componentName: QuasmComponent, message: string) {
        console.log(this.format('WARNING', componentName, message));
    }

    error(componentName: QuasmComponent, message: string) {
        console.log(this.format('ERROR', componentName, message));
    }

    debug(componentName: QuasmComponent, message: string) {
        console.log(this.format('DEBUG', componentName, message));
    }
}

export const logger = new Logger();
