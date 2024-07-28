FROM node:22.4-alpine3.19
WORKDIR /coursemate/dev/server

COPY package.json package-lock.json ./
RUN npm ci

COPY ./prisma ./
RUN npx prisma generate

COPY . .

RUN npm run build
CMD npx prisma db push && npm run serve
