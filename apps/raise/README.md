# Tmra Raise

..
The API service backend for Tmra Organization, serving both OpenAPI and GraphQL protocols.

This mono-repo contain:\
BackEnd (Raise Folder) [NESTJS] For Tender Management (with prefix "tender-"), Giving Sadaqah, and Ommar\
FrontEnd (pwa Folder) [React] For Tender Management

## Installation

```bash
yarn
```

## yarn PnP Editor SDK - VS Code

**Important:** Make sure you follow the instructions in the root workspace's `README.md`
regarding **yarn PnP Editor SDK - VS Code**. Otherwise, your Gitpod / VS Code IDE features will not work well.

## Running the app

```bash
# development & watch mode
yarn start:dev

# production mode
yarn start:prod
```

## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## Deploy

Choose the target environment:

```bash
yarn push:dev
yarn push:qc
yarn push:staging
yarn push:prod
```


# Backend 101
notes:
 - This repo is using FASTIFY instead of EXPRESS.
 - Please use WINSTON (log/warn/errors), and provide a clear information in the logs.
## Prisma related error

if you get any error regarding prisma, like the code has missing field and so on, you can pull the latest change on the prisma schema
with db pull and generate for the typing

```bash
npx prisma db pull --schema src/prisma/schema.prisma
npx prisma generate --schema src/prisma/schema.prisma
```

## Libs and Commons
both of this modules are specials, diffrent from other modules.

### Libs
Containing bunch of NestJS Library configured as @Global decorator that can used trough the other modules, all of the modules are called on "Shared" Modules.

### Commons
Containing Reusable types, utils, etc

- configs:\
not used for time beings, it will contain how to load .env and validate the env to make sure the .env is exist and has correct types.

- decorators:\
as it names, it contain decorators, that can be reusable trough out this repo\
refs:\
https://docs.nestjs.com/custom-decorators \
https://docs.nestjs.com/openapi/decorators

- dtos:\
DTO (Data Transfer Object), this represents the data that in and out from the system (Payload).\
on this repo we used Class Validator and Class Transformer as an official DTO for NESTJS\
refs:\
NESTJS: https://docs.nestjs.com/techniques/validation \
CLASS-VALIDATOR: https://github.com/typestack/class-validator#readme \
CLASS-TRANSFORMER: https://github.com/typestack/class-transformer/#readme

- enums

- helpers\
Function that commonly used for building response / throw errors and etc.\

- utils\
Commonly used funcions.

- interfaces
