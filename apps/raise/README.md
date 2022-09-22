# Tmra Raise

.
The API service backend for Tmra, serving both OpenAPI and GraphQL protocols.

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
