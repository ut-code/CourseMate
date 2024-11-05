FROM oven/bun:latest
WORKDIR /coursemate/dev/web

COPY package.json package-lock.json ./
RUN npm ci

ENV NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000
COPY ./ .

CMD npm run dev -- --host
