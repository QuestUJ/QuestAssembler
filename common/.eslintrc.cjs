module.exports = {
    env: {
        es2021: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
        tsconfigRootDir: __dirname
    },
    plugins: ['@typescript-eslint', 'simple-import-sort', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:prettier/recommended'
    ],
    rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error"
    }
};
