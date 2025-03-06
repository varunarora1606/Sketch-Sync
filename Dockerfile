FROM node:20-alpine

ARG DATABASE_URL

RUN npm i -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .


ENV DATABASE_URL=${DATABASE_URL}

RUN pnpm i
RUN pnpm run db:generate
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]