FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

FROM node:22-alpine AS production

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

USER nestjs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main.js"]