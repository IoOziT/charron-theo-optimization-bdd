# syntax=docker/dockerfile:1-labs
FROM node:22 AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm


FROM base AS production-deps

RUN pnpm i --frozen-lockfile --prod


FROM base AS dev-deps

RUN pnpm i --frozen-lockfile


FROM dev-deps AS dev

COPY tsconfig.json .
COPY --exclude=src/db/migrations/**/*.ts --exclude=src/db/seeds/**/*.ts src/ /app/src/

RUN pnpm run build


FROM dev-deps AS migrator

COPY kysely.config.ts db-setup.sh ./
COPY src/db/migrations/ /app/src/db/migrations/
COPY src/db/seeds/ /app/src/db/seeds/

ENTRYPOINT ["/app/db-setup.sh"]


FROM node:22

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=dev /app/dist /app/

EXPOSE 3000

HEALTHCHECK CMD curl -sS http://localhost:3000/status || exit 1

ENTRYPOINT [ "node" ]
CMD [ "/app/serve.js" ]