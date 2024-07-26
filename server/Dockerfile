FROM node:22.4-alpine3.19
WORKDIR /coursemate/dev/

# install deps
COPY ./server/package.json ./server/package-lock.json ./server/tsconfig.json ./server/
RUN cd server; npm ci

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

#TOOD: ENV DATABASE_URL=postgres://postgres:mysecretpassword@coursemate_db:5432/
# COPY ./server ./server

# set up prisma
COPY ./server/prisma ./server/prisma
RUN cd server; npx prisma generate

COPY . .
RUN npm run prepare

# build
RUN cd server; npm run build
CMD cd server; npx prisma db push && npm run start
