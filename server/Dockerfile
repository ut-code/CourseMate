FROM node:22.4-alpine3.19 AS builder
WORKDIR /coursemate/builder/server
COPY package.json package-lock.json .
RUN npm ci
ENV DATABASE_URL=postgres://postgres:mysecretpassword@coursemate_db:5432/
COPY src/prisma ./src/prisma
RUN npx prisma generate --schema ./src/prisma/schema.prisma
COPY . .
CMD npx prisma db push --schema ./src/prisma/schema.prisma && npm run dev
