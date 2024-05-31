import { QuasmComponent } from '@quasm/common';
import chalk from 'chalk';

const ComponentColorMap: Record<string, (str: string) => string> = {
    [QuasmComponent.HTTP]: chalk.cyan,
    [QuasmComponent.SOCKET]: chalk.redBright
};

class Logger {
    private format(level: string, location: string, msg: string[]) {
        const I = chalk.gray('|');
        const locationStyle = ComponentColorMap[location];
        return `${chalk.gray(new Date().toISOString())} ${I} ${level} ${I} ${locationStyle ? locationStyle(location) : location} ${I} ${msg.join(` ${I} `)}`;
    }

    info(componentName: QuasmComponent, message: string[]) {
        console.log(this.format(chalk.blue('INFO'), componentName, message));
    }

    warning(componentName: QuasmComponent, message: string[]) {
        console.log(
            this.format(chalk.yellow('WARNING'), componentName, message)
        );
    }

    error(componentName: QuasmComponent, message: string[]) {
        console.log(this.format(chalk.red('ERROR'), componentName, message));
    }

    debug(componentName: QuasmComponent, message: string[]) {
        console.log(this.format('DEBUG', componentName, message));
    }
}

export const logger = new Logger();
