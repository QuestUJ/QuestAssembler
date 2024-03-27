import { ErrorLocation, QuasmError } from './QuasmError';

type ConfigField = number | string | boolean | undefined

export class Config<ConfigMap extends Record<string, ConfigField>> {
    constructor(private readonly _configMap: ConfigMap) {}

    pick<T extends keyof ConfigMap>(keys: T[]): Pick<ConfigMap, T> {
        const missingKeys: string[] = [];
        const values = keys.reduce(
            (acc, key) => {
                if (
                    this._configMap[key] === '' ||
                    this._configMap[key] === undefined
                ) {
                    missingKeys.push(key as string);
                    return acc;
                }
                acc[key] = this._configMap[key];
                return acc;
            },
            {} as Pick<ConfigMap, T>
        );

        if (missingKeys.length > 0) {
            throw new QuasmError(
                ErrorLocation.CONFIG,
                -1,
                `Expected configuration not found: ${missingKeys.join(',')}`
            );
        }

        return values;
    }

    static loadString(key: string): string | undefined {
        return process.env[key]?.toString();
    }

    static loadBool(key: string): boolean | undefined {
        return !!process.env[key];
    }

    static loadInt(key: string): number | undefined {
        return parseInt(process.env[key] ?? '') ?? undefined;
    }
}
