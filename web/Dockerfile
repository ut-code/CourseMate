FROM node:22.4-alpine3.19 as builder
WORKDIR /coursemate/dev/web
COPY package.json package-lock.json ./
RUN npm ci
ENV VITE_API_ENDPOINT=http://localhost:3000
COPY ./ .

FROM golang:1.22.6-alpine3.19 as go-builder
WORKDIR /coursemate/dev/web/
COPY ./static-server ./static-server
RUN cd static-server; go build -o exec .

FROM alpine:latest as runner
WORKDIR /coursemate/dev/web
COPY --from=builder ./static .;
COPY --from=go-builder ./static-server/exec .;
CMD ./static-server/exec;
