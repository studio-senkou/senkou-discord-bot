FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock bunfig.toml ./

ENV NODE_ENV=production

RUN bun install --production --frozen-lockfile

COPY . .

RUN bun run build

RUN rm -rf src/ node_modules/.cache

EXPOSE 8787

CMD ["bun", "run", "./dist/main.js"]