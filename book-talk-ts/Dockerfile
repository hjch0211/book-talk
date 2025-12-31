FROM node:23-alpine
WORKDIR /app

COPY package.json yarn.lock ./
COPY packages ./packages

RUN yarn install --production --frozen-lockfile

EXPOSE 3001
CMD ["node", "packages/ai/dist/main.js"]
