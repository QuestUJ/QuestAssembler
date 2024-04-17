# Quest Assembler monorepo v1

First prototype of the project structure

## Useful resources

Here are some useful resources about tools and packages used in project

- **Server**
  - [Socket.io](https://socket.io/) - 2-way communication
  - [Express.js](https://expressjs.com/) - HTTP server
  - [Kysely](https://kysely.dev/) - SQL builder & migration tooling
  - [PostgreSQL](https://www.postgresql.org/docs/current/index.html) - Database engine
- **Client**
  - [React](https://react.dev/) - frontend framework
  - [Tailwindcss](https://tailwindcss.com/) + [Shadcn](https://ui.shadcn.com/) - UI system
  - [Vite](https://vitejs.dev/) - build system
- **Linters/Formatters etc.**
  - [Prettier](https://prettier.io/)
  - [ESlint](https://eslint.org/)
  - [Typescript](https://www.typescriptlang.org/)

There are some other minor tools but we can ignore them

## Production build

Not important, trust me on this :)

## Development workflow

### Prerequisites

The one essential thing you will need is node.js
I recommend installing nvm - node version manager

[https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

and then run `nvm install stable` and it's done
Alternatively you can install directly a newest version, but with nvm you can easily switch version of node.js which can be useful in avoiding compatibility bugs (But i hope we won't encounter them so maybe you won't need it)

With `node` you should also have installed `npm` automatically

Now install `pnpm` A better package manager for node.js. Just run this

`npm install -g pnpm`

Now you can verify if you have everything you need:

```bash
pnpm -v
node -v
```

You should see printed versions of both tools

### Project setup

Clone this repo

Now you will need 2 separate terminal sessions in first go into `server` directory in second to `client`

#### Server

- `pnpm install` to install dependencies
- `chmod +x ./src/infrastructure/postgres/local.sh` this will add execution rights to the script (You need it on Unix-like OS)
- `pnpm postgres:setup` If you have docker installed this command will automatically setup a docker container with postgresql running inside on port 5434
- `pnpm postgres:migrate` this command will run database migrations, for now there's only one test migration to ensure it's working, this will change,
- `pnpm dev` this command will launch your dev server by default on port 3000, now if you edit source code your server will automatically rebuild

#### Client

- `pnpm install` to install dependencies
- `pnpm dev` to start a dev server on port 3001 by default, if you edit source code it will auto rebuild
- Now you can go to your browser to [http://localhost:3001](http://localhost:3001) and you should be able to test your app

### Tooling

- `pnpm format` will automatically format code
- `pnpm lint:fix` this will show linter errors and try to fix the primitive ones

We should always format and lint code before pushing to repo to keep it clean (If we will keep forgetting, we will setup prehook, but I'm hoping it won't be necessary)

NOTE!: Formatting and linter errors should be integrated with your languague server, so if you use IDE or VS code with auto LSP magic it should be working by default, for more edgy tools like NeoVim you have to configure it for yourself (but it's not that hard)

### Github workflow, Pull Requests, Merge strategy

#### TODO!!!
