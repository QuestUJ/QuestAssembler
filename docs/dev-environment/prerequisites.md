# Prerequisites
This page covers basic tools and environment setup used in the project

## Operating system
Development on windows is technically possible, but it requires some additional configuration from you, instead of fighting with this config hell I suggest using [WSL](https://learn.microsoft.com/pl-pl/windows/wsl/about), cause you will probably need it for docker as well

how to install: <https://learn.microsoft.com/en-us/windows/wsl/install>

## Node.js
Most popular javascript runtime

Recommended install method: [nvm](https://github.com/nvm-sh/nvm)

but every other method should also be fine, to verify you have node up and running run
```bash
node -v
npm -v
```
## Package manager: pnpm
Project is a monorepo based on pnpm workspaces so unless you are motivated to make it compatible with yarn/npm workspaces you should use [pnpm](https://pnpm.io/)

how to install: run command `npm install -g pnpm`

## Database: PostgreSQL

Project is using PostgreSQL on database side, so if you want to develop things related to database or run e2e tests etc. you will need PostgreSQL up and running. Postgres setup will be super easy if:
- You have UNIX based OS (That's what WSL is needed for)
- You have docker installed

To install docker most straightforward option is to install docker desktop <https://docs.docker.com/engine/install/>

Note: don't forget to turn on WSL integration in docker desktop in settings

With docker installed, from your unix based system you can simply run:
```bash
chmod +x ./src/infrastructure/postgres/local.sh # This allows handy script to run
pnpm postgres:setup
```
And that's it! now you should have a docker container with postgres inside created. You can manage it from docker desktop.

PostgreSQL default settings:
- PORT: 5434 - not the default look out
- USER: postgres
- PASSWORD: root
- DBNAME: quasm

As I mentioned you don't really have to use docker and unix (but it's easiest), you can simply install postgres with any method, then set it up with same config as the postgres in the docker

### Next step
With tools essentials setup you can check [useful-scripts](./useful-scripts.md)