FROM node:alpine AS build

COPY . /app

WORKDIR /app

RUN npm i

RUN npm run build

FROM node:alpine AS dependency

COPY --from=build /app/package.json /app/package-lock.json /app/

WORKDIR /app

RUN npm i --omit=dev

FROM alpine AS runtime

RUN apk add --no-cache nodejs

COPY --from=build /app/dist /app/dist
COPY --from=dependency /app/node_modules /app/node_modules

WORKDIR /app

CMD ["node", "dist/main.js"]
