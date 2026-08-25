FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src
COPY public ./public
COPY tsconfig.json ./

RUN npm run build


FROM node:22-alpine AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/views ./src/views
COPY --from=build /app/public ./public

EXPOSE 4000

USER node

CMD ["node", "dist/index.js"]
