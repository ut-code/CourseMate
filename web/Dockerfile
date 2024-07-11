FROM node:22.4-alpine3.19
WORKDIR /coursemate/dev/web
COPY package.json package-lock.json ./
RUN npm ci
ENV VITE_API_ENDPOINT=http://server:3000
COPY . .

# supports hot reload
CMD npm run dev -- --host
