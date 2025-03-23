FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

FROM node:22-alpine AS runner
WORKDIR /app
COPY package.json yarn.lock ./

RUN mkdir -p ./assets || true

RUN yarn --production

COPY --from=deps /app/dist ./dist

EXPOSE 8000
ENV PORT 8000

CMD ["node", "dist/src/main"]
