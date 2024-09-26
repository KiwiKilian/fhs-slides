---
layout: section
hideInToc: false
---

# Dockerfile

```dockerfile {1-20|21-34}{maxHeight:'100%'}
FROM node:20.17.0-alpine AS base

LABEL maintainer="hello@example.com"
LABEL description="Node.js/NestJS application"

RUN apk update && apk add tzdata

FROM base AS builder
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_RELEASE

WORKDIR /app/

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm run sentry:sourcemaps

FROM base AS runner
ARG SENTRY_RELEASE

WORKDIR /app/

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/dist ./dist/

ENV TZ=Europe/Vienna
ENV SENTRY_RELEASE=$SENTRY_RELEASE

EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]
```
