FROM node:17.0.1-alpine3.13 as build

COPY package.json .
RUN yarn

COPY . ./
RUN yarn build
ENV NODE_ENV production

FROM node:17.0.1-alpine3.13 as run

COPY package.json .
RUN yarn --prod

ENV NODE_ENV production
EXPOSE 8083
COPY --from=build /dist ./app

CMD ["node", "./app/index.js"]