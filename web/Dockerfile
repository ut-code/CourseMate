FROM node:22.4-alpine3.19
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# supports hot reload
CMD npx run dev
