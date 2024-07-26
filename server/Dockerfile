FROM node:22.4-alpine3.19
WORKDIR /coursemate/dev/server
COPY ./server/package.json ./server/package-lock.json ./
RUN npm ci
# ENV DATABASE_URL=postgres://postgres:mysecretpassword@coursemate_db:5432/
COPY ./server .
COPY ./common ../common

# setup typia
COPY node_modules package.json package-lock.json tsconfig.json ../
RUN cd ..; npm ci

# set up prisma
COPY ./server/prisma ./
RUN npx prisma generate

# build
RUN npm run build
CMD npx prisma db push && npm run start
