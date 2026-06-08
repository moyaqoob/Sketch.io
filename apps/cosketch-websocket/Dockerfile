FROM oven/bun:1

WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_WS_URL


ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}

# Copy root workspace metadata first
COPY package.json bun.lock* ./

# Copy only the workspaces required by backend
COPY packages ./packages
COPY apps/cosketch-websocket ./apps/cosketch-websocket

RUN bun install
WORKDIR /app/packages/database
RUN bunx prisma generate

WORKDIR /app/apps/cosketch-websocket
RUN bun run build


EXPOSE 8000

CMD ["bun", "run", "start:websocket"]
