# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.14.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="NestJS"
WORKDIR /app

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config

# Install node modules
COPY --link package-lock.json package.json ./

FROM base AS development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
RUN npm i --include=dev
COPY  --link . .
EXPOSE 3000

FROM base AS build
RUN npm ci 
COPY --link . .
RUN npm run build

FROM base AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --from=build /app /app
EXPOSE 3000
CMD [ "npm", "run", "start" ]
