FROM node:15-alpine as build

COPY package.json .
RUN yarn

COPY . ./
RUN yarn build
ENV NODE_ENV production

FROM node:15-alpine as run

COPY package.json .
RUN yarn --prod

ENV NODE_ENV production
EXPOSE 8083
COPY --from=build /dist ./app

CMD ["node", "./app/index.js"]