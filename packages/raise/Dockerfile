# https://github.com/Saluki/nestjs-template/blob/master/Dockerfile

# --- Builder ---

# FROM node:lts-slim AS builder

# ARG CI=true
# ARG NODE_ENV=build

# USER node
# WORKDIR /home/node

# COPY lerna.json /home/node/
# COPY .yarnrc.yml /home/node/
# COPY package*.json /home/node/
# COPY yarn.lock /home/node/
# COPY .yarn/ /home/node/.yarn/
# COPY packages/ /home/node/packages/

# RUN yarn --immutable

# WORKDIR /home/node/packages/raise
# # RUN yarn --immutable
# RUN yarn build

# --- Runtime ---

FROM node:lts-slim

ENV NO_COLOR=1
ENV FORCE_COLOR=0
ENV NODE_ENV=production
ENV APP_ENV=prod
ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}

WORKDIR /app/

RUN addgroup --gid 1001 --system nodejs
RUN adduser --system nestjs --uid 1001 --ingroup nodejs

# Root
COPY .pnp.* ./
COPY .yarnrc.yml ./
COPY package.json ./
COPY .yarn/ ./.yarn/
COPY yarn.lock ./

# COPY postman/schemas/ ./postman/schemas/

# COPY --from=builder /app/node_modules/ ./node_modules/
# package.json ONLY from all other packages, yarn monorepo needs them to ensure immutability
# BUT will still need depended packages' dist/
COPY packages/pwa/package.json ./packages/pwa/
# COPY packages/notion-api/dist/ ./packages/notion-api/dist/
# This package
COPY packages/raise/package.json ./packages/raise/
# COPY packages/raise/node_modules/ ./packages/raise/node_modules/
# COPY packages/raise/tsconfig.json ./packages/raise/
# COPY packages/raise/nest-cli.json ./packages/raise/
COPY packages/raise/dist/ ./packages/raise/dist/

USER node
WORKDIR /app/packages/raise
EXPOSE 3000
CMD ["yarn", "start:prod"]
