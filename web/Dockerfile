FROM node:22.4-alpine3.19
WORKDIR /coursemate/dev/web

COPY package.json package-lock.json ./
RUN npm ci

ENV VITE_API_ENDPOINT=http://localhost:3000
COPY ./ .

CMD npm run dev -- --host
