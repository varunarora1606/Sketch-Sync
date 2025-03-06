FROM node:20-alpine

ARG DATABSE_URL

RUN node i pnpm -g

COPY . .

RUN pnpm i
RUN DATABASE_URL=$DATABSE_URL pnpm run db:generate
RUN DATABASE_URL=$DATABSE_URL pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]