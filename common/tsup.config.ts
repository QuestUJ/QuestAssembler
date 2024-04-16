import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['./src/*.ts'],
    sourcemap: true,
    dts: true,
    clean: true,
    format: ['cjs', 'esm']
});
