FROM node:23-alpine AS builder
WORKDIR /app

# workspace 전체를 빌드 타임에만 사용
COPY package.json yarn.lock ./
COPY packages ./packages

RUN yarn install --frozen-lockfile
RUN yarn workspace @book-talk/ai build

FROM node:23-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

# dist + package.json
COPY --from=builder /app/packages/ai/dist ./packages/ai/dist
COPY --from=builder /app/packages/ai/package.json ./packages/ai/package.json

EXPOSE 3001
CMD ["node", "packages/ai/dist/main.js"]
