FROM node:22.4-alpine3.19
WORKDIR /coursemate/dev/server
COPY package.json package-lock.json ./
RUN npm ci
ENV DATABASE_URL=postgres://postgres:mysecretpassword@coursemate_db:5432/
COPY ./prisma ./
RUN npx prisma generate
COPY . .

CMD npx prisma db push && npm run dev
