FROM node:15-alpine as build

COPY package.json .
RUN yarn

COPY . ./
RUN yarn build
EXPOSE 8083
ENV NODE_ENV production

CMD ["node", "./dist/index.js"]