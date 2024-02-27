FROM alpine as nodejs

RUN apk add --no-cache nodejs

# ---

FROM alpine AS patcher

WORKDIR /app

RUN apk add git

COPY patches /patches

RUN git clone https://github.com/PerformanC/NodeLink.git .

RUN git apply /patches/*.patch

# ---

FROM nodejs AS deps_resolver

WORKDIR /app

RUN apk add npm python3 make gcc g++ musl-dev

COPY --from=patcher /app/package.json /app/package.json

RUN npm i --omit=dev --force

# ---

FROM nodejs AS runtime

WORKDIR /app

COPY --from=patcher /app/package.json /app/config.js /app/constants.js /app/
COPY --from=patcher /app/src /app/src
COPY --from=deps_resolver /app/node_modules /app/node_modules

ENTRYPOINT [ "node", "src/connection/index.js" ]
