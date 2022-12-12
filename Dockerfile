# Build stage
FROM node:18-alpine AS build
ARG APP_ENV
ENV NODE_ENV $APP_ENV

RUN echo "Building for $APP_ENV"

WORKDIR /app

COPY package.json yarn.lock ./

RUN chown -R node:node /app

USER node

RUN yarn install

COPY . .

RUN yarn build

# Production stage
FROM node:18-alpine
ARG APP_ENV
ENV NODE_ENV $APP_ENV

RUN echo "Running for $NODE_ENV"

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/.env ./.env

RUN chown -R node:node /app

USER node

RUN yarn install --production

RUN yarn prisma:migrate

EXPOSE 3000

CMD ["yarn", "start:prod"]
