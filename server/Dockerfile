FROM node:22.4-alpine3.19
WORKDIR /coursemate/dev/server
COPY ./server/package.json ./server/package-lock.json ./
RUN npm ci
# ENV DATABASE_URL=postgres://postgres:mysecretpassword@coursemate_db:5432/
COPY ./server/prisma ./
RUN npx prisma generate
COPY ./server .
COPY ./common ../common
RUN npm run prepare

CMD npx prisma db push && npm run dev
