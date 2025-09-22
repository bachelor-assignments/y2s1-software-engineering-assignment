FROM node:24.8.0-alpine3.21 AS base

WORKDIR /app

COPY package.json yarn.lock ./

FROM base AS development

RUN yarn install

COPY . .

CMD ["yarn", "run", "dev", "-p", "3000"]

FROM base AS production-builder

ENV NODE_ENV=production

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

FROM nginx:stable AS production

COPY --from=production-builder /app/.next /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]