FROM node:22.4-alpine3.19 as builder
WORKDIR /coursemate/build/web
COPY package.json package-lock.json ./
RUN npm ci
ENV VITE_API_ENDPOINT=http://localhost:3000
COPY ./ .

FROM golang:1.22.6-alpine3.19 as go-builder
WORKDIR /coursemate/build/web
COPY ./static-server .
RUN go build -o ./exec .

FROM alpine:latest as runner
WORKDIR /coursemate/target/web
COPY --from=builder /coursemate/build/web/dist ./dist
COPY --from=go-builder /coursemate/build/web/exec ./
CMD ./exec;
