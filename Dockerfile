# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.2.2
FROM oven/bun:${BUN_VERSION}-slim AS base
LABEL fly_launch_runtime="Bun/Prisma"
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build
# RUN apt-get update -qq && \
    # apt-get install --no-install-recommends -y build-essential openssl pkg-config

WORKDIR /build
ARG SQL_GENERATE_URL
ENV DATABASE_URL=$SQL_GENERATE_URL
RUN test -n "${DATABASE_URL}"
COPY . .
RUN --mount=type=cache,target=~/.bun/install bun install --frozen-lockfile --ignore-scripts
RUN cd server; bun prisma generate --sql
RUN cd server; bun run :build


# Final stage for app image
FROM base AS runner
WORKDIR /srv

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /build/server/target/index.js /srv/index.js

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "run", "./index.js" ]
