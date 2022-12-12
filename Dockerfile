# Build stage
FROM node:18-alpine AS build
ARG APP_ENV
ENV NODE_ENV $APP_ENV

RUN echo "Building for $APP_ENV"

USER node

WORKDIR /app

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install

COPY --chown=node:node . .

RUN yarn prisma:migrate

RUN yarn build

# Production stage
FROM node:18-alpine
ARG APP_ENV
ENV NODE_ENV $APP_ENV

RUN echo "Running for $NODE_ENV"

USER node

WORKDIR /app

COPY --chown=node:node --from=build /app/package.json ./package.json
COPY --chown=node:node --from=build /app/yarn.lock ./yarn.lock
COPY --chown=node:node --from=build /app/dist ./dist

RUN yarn install --production

EXPOSE 3000

CMD ["yarn", "start:prod"]