# Backend image for Fly.io (monorepo root build context).
# Replaces the fly launch template that runs `turbo run build` for every app.

FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock* ./
COPY packages ./packages
COPY apps/cosketch-backend ./apps/cosketch-backend

RUN bun install

WORKDIR /app/packages/database
RUN bunx prisma generate

WORKDIR /app/apps/cosketch-backend
RUN bun run build

EXPOSE 9000

CMD ["bun", "run", "start:backend"]
