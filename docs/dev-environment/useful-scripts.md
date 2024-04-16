# Useful Scripts

- `pnpm install` - run from any directory inside project will install project dependencies (deps stored in `node_modules`)
- `pnpm format` - will format package source code using prettier 
- `pnpm lint` - will run linter for package source code
- `pnpm lint:fix` - same as `pnpm lint` but will try to fix simpler errors
- `pnpm dev` - runs a development server of the package
- `pnpm build` - builds the package
- `pnpm test` - runs unit tests

## server (available only in server package)
- `pnpm postgres:migrate` - runs cli migration tool


### Next step
Have a look at short note on `common/` package [here](./deps&common.md)