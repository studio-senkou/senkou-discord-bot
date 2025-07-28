FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lockb* bunfig.toml ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

RUN rm -rf src/ tsconfig.json && \
    bun install --production --frozen-lockfile && \
    rm -rf node_modules/.cache

EXPOSE 8787

CMD ["bun", "run", "./dist/main.js"]