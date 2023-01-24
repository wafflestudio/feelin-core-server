# Build stage
FROM node:18.12-alpine3.16 AS build
ARG APP_ENV
ENV NODE_ENV $APP_ENV

RUN echo "Building for $APP_ENV"

WORKDIR /app

COPY package.json yarn.lock ./

RUN chown -R node:node /app

RUN yarn install

COPY . .

RUN chown -R node:node /app/node_modules/@prisma
RUN chown -R node:node /app/node_modules/prisma
RUN chown -R node:node /app/node_modules/.prisma
RUN mkdir /app/dist && chown -R node:node /app/dist

USER node

RUN yarn prisma:generate && yarn build

# Production stage
FROM node:18.12-alpine3.16
ARG APP_ENV
ENV NODE_ENV $APP_ENV

RUN echo "Running for $NODE_ENV"

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/.env ./.env
COPY --from=build /app/AuthKey.p8 ./AuthKey.p8 
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

RUN yarn install --production

USER node

EXPOSE 3000

CMD ["yarn", "start:prod-deploy"]
