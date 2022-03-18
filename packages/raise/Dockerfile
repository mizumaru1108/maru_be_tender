# https://github.com/Saluki/nestjs-template/blob/master/Dockerfile

# --- Builder ---

FROM node:lts-slim AS builder

ARG CI=true
ARG NODE_ENV=build

USER node
WORKDIR /home/node

COPY lerna.json /home/node/
COPY .yarnrc.yml /home/node/
COPY package*.json /home/node/
COPY yarn.lock /home/node/
COPY .yarn/ /home/node/.yarn/
COPY packages/ /home/node/packages/

RUN yarn --immutable

WORKDIR /home/node/packages/raise
# RUN yarn --immutable
RUN yarn build

# --- Runtime ---

FROM node:lts-slim

ENV NO_COLOR=1
ENV FORCE_COLOR=0
ENV NODE_ENV=staging
ENV APP_ENV=staging
ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}

USER node
WORKDIR /home/node/

COPY --from=builder /home/node/.yarnrc.yml ./
# Uncomment if using pnp nodeLinker:
COPY --from=builder /home/node/.pnp.* ./
# Uncomment if using node-modules nodeLinker:
# COPY --from=builder /home/node/node_modules/ ./node_modules/
COPY --from=builder /home/node/package*.json ./
COPY --from=builder /home/node/.yarn/ ./.yarn/
COPY --from=builder /home/node/packages/raise/dist/ ./packages/raise/dist/

EXPOSE 3000
CMD ["node", "-r", "./.pnp.cjs", "packages/raise/dist/main.js"]
# CMD ["node", "packages/raise/dist/main.js"]
