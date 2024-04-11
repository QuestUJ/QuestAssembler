class Logger {
    private format(location: string, level: string, msg: string) {
        return `${new Date().toISOString()} | ${level} | ${location} | ${msg}`;
    }

    info(componentName: string, message: string) {
        console.log(this.format(componentName, 'INFO', message));
    }

    warning(componentName: string, message: string) {
        console.log(this.format(componentName, 'WARNING', message));
    }

    error(componentName: string, message: string) {
        console.log(this.format(componentName, 'ERROR', message));
    }

    debug(componentName: string, message: string) {
        console.log(this.format(componentName, 'DEBUG', message));
    }
}

export const logger = new Logger();
