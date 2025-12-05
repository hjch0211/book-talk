FROM node:22-alpine

WORKDIR /app

COPY dist ./dist
COPY package.json ./

RUN yarn install --production --frozen-lockfile

EXPOSE 3001

CMD ["node", "dist/main.js"]
