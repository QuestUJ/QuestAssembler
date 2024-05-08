import { ErrorCode, QuasmError } from './QuasmError';
import { QuasmComponent } from './Structure';

type ConfigField = number | string | boolean | undefined;

type NonNullableFields<T> = {
    [K in keyof T]: NonNullable<T[K]>;
};

export class Config<ConfigMap extends Record<string, ConfigField>> {
    private static _env: Record<string, string | undefined>;

    constructor(private readonly _configMap: ConfigMap) {}

    pick<T extends keyof ConfigMap>(
        keys: T[]
    ): NonNullableFields<Pick<ConfigMap, T>> {
        const missingKeys: string[] = [];
        const values = keys.reduce(
            (acc, key) => {
                if (
                    this._configMap[key] === '' ||
                    this._configMap[key] === undefined ||
                    this._configMap[key] === null
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
                QuasmComponent.CONFIG,
                -1,
                ErrorCode.MissingConfig,
                `Expected configuration not found: ${missingKeys.join(',')}`
            );
        }

        return values as NonNullableFields<Pick<ConfigMap, T>>;
    }

    static initEnv(env: Record<string, string | undefined>) {
        this._env = env;
    }

    static loadString(key: string): string | undefined {
        return Config._env[key]?.toString();
    }

    static loadBool(key: string): boolean | undefined {
        return !!Config._env[key];
    }

    static loadInt(key: string): number | undefined {
        return parseInt(Config._env[key] ?? '') ?? undefined;
    }
}
