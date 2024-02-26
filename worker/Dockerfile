FROM alpine AS builder

RUN apk add go

WORKDIR /app

COPY go.mod go.sum /app/

RUN --mount=type=cache,target=/root/.cache/go-build go mod download

COPY . /app/

ENV CGO_ENABLED=0

RUN --mount=type=cache,target=/root/.cache/go-build go build -o /app/main

FROM scratch AS runtime

WORKDIR /app

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/main /app/main

ENTRYPOINT ["/app/main"]
