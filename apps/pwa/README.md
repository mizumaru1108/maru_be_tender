# Minimal TypeScript v3.5.0 react-scripts_TS

`force-build-test`

.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 1.Install

### npm

```
npm i
or
npm i --legacy-peer-deps
```

### yarn

```
yarn install
```

## 2.Start

```sh
npm start
or
yarn start
```

## 3.Build

```sh
npm run build or yarn build
```

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your app is ready to be deployed.

## Deploy to dev/qc/staging/prod

First, you **must** commit and push to `main` branch.

To deploy to `dev` namespace in our Kubernetes cluster: ( https://app-dev.tmra.io/ )

```bash
yarn push:dev
```

To deploy to `qc` namespace in our Kubernetes cluster: ( https://app-qc.tmra.io/ )

```bash
yarn push:qc
```

To deploy to `staging` namespace in our Kubernetes cluster: ( https://app-staging.tmra.io/ )

```bash
yarn push:staging
```

To deploy to `prod` namespace in our Kubernetes cluster: ( https://app.tmra.io/ )

```bash
yarn push:prod
```

## User Guide

You can find detailed instructions on using Create React App and many tips in [its documentation](https://facebook.github.io/create-react-app/).
