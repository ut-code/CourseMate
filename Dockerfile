# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.2.2
FROM oven/bun:${BUN_VERSION} AS base
LABEL fly_launch_runtime="Bun/Prisma"
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

WORKDIR /build
ARG SQL_GENERATE_URL
RUN test -n "${SQL_GENERATE_URL}"
ENV DATABASE_URL=$SQL_GENERATE_URL
ENV DIRECT_URL=$SQL_GENERATE_URL
COPY . .
RUN --mount=type=cache,target=~/.bun/install bun install:production
RUN cd server; bun prisma generate --sql
RUN cd server; bun run :build


# Final stage for app image
FROM base AS runner
WORKDIR /srv

# Copy built application
COPY --from=build /build/server/target/index.js /srv/index.js
COPY --from=build /build/node_modules/.prisma/client /node_modules/.prisma/client
COPY --from=build /build/node_modules/@img /node_modules/@img

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "run", "./index.js" ]
