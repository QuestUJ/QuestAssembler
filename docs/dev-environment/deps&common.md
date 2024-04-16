# Dependencies and common package
`server/` and `client/` packages depend on `common/` package, so before you start working you almost always want to first run:

```bash
pnpm install # from somewhere in the project
pnpm build # from inside a common package
```

### Next step
See:
- [Technologies used and overall architecture](./techstack&architecture.md)
- [unit-tests](./unit-tests.md)
- [e2e testing](./e2e.md)
