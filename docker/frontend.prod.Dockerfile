# ============================
# Frontend Dockerfile (Bun)
# ============================

FROM oven/bun:1.2.9@sha256:7eb9c0438a42438d884891f5460d6f5b89c20797cb58062b6d28ccba725a8c42

WORKDIR /app


# Copy necessary files for dependency installation
COPY ../package.json ./package.json
COPY ../bun.lock ./bun.lock
COPY ../turbo.json ./turbo.json
COPY ../packages ./packages
COPY ../apps/cosketch-frontend ./apps/cosketch-frontend

# Install dependencies
RUN bun install

# Build the Next.js app
RUN bun run build

# Expose and run
EXPOSE 3000
CMD ["bun", "run", "start:frontend"]