FROM node:22.4-alpine3.19
WORKDIR /coursemate/dev/server
COPY ./server/package.json ./server/package-lock.json ./
RUN npm ci
# ENV DATABASE_URL=postgres://postgres:mysecretpassword@coursemate_db:5432/
COPY ./server/prisma ./
RUN npx prisma generate
COPY ./server .
COPY ./common ../common
COPY node_modules package.json package-lock.json tsconfig.json ../
RUN cd ..
RUN npm install
RUN cd server
RUN npm run build

CMD npx prisma db push && npm run start
