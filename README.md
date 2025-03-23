# CoSketch

![CoSketch banner](https://github.com/NarsiBhati-Dev/CoSketch/blob/master/apps/cosketch-frontend/public/images/social-banner-4.jpeg?raw=true)

CoSketch is a **real-time collaborative drawing application** built using **Turborepo** and **Bun**. It includes separate apps for the frontend, backend API, and WebSocket server to enable seamless collaboration.

---

## 🏗 Project Structure

This monorepo is managed using **Turborepo** and is structured as follows:

```sh
cosketch/
├── apps/ # Contains independent applications
│   ├── cosketch-frontend/        # Next.js app for the UI
│   ├── cosketch-backend/         # Express backend for API handling
│   ├── cosketch-websocket/       # WebSocket server for real-time collaboration
├── packages/ # Shared code across apps
│   ├── database/        # Prisma & PostgreSQL setup
│   ├── types/           # Shared TypeScript types
│   ├── ui/              # Shared UI components (e.g., buttons, modals)
│   ├── backend-common/  # Common utilities for backend services
├── turbo.json           # Turborepo config file
├── package.json         # Root package.json for Bun & Turborepo setup
└── README.md            # Project documentation
```

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies

Ensure **Bun** is installed on your system:

```sh
bun install
```

### 2️⃣ Start the Development Environment

Use Turborepo to start all apps simultaneously:

```sh
bun run dev
```

### 3️⃣ Run Individual Apps

You can start specific apps independently:

```sh
# Start frontend (Next.js)
bun run dev --filter=cosketch-frontend

# Start backend (Express API)
bun run dev --filter=cosketch-backend

# Start WebSocket server
bun run dev --filter=cosketch-websocket
```

---

## 📦 Tech Stack

- **Turborepo** → Monorepo management
- **Bun** → Fast JavaScript package manager & runtime
- **Next.js** → Frontend framework
- **Express.js** → Backend API
- **WebSockets** → Real-time collaboration
- **PostgreSQL** → Database
- **Prisma** → ORM for database management
- **Docker** → Containerized database for development
- **Sharp** → Image processing

---

## 🗄 Database Setup

### Start PostgreSQL with Docker

```sh
bun db:up
```

### Stop PostgreSQL

```sh
bun db:down
```

### Run Database Migrations

```sh
bun prisma migrate deploy
```

### Connect to PostgreSQL via CLI

```sh
docker exec -it <postgres_container_name> psql -U <your_db_user> -d <your_database>
```

> Replace `<postgres_container_name>`, `<your_db_user>`, and `<your_database>` accordingly.

---

## 📜 Available Scripts (Root `package.json`)

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "check-types": "turbo run check-types",
    "db:up": "docker-compose -f docker/docker-compose.yml up -d",
    "db:down": "docker-compose -f docker/docker-compose.yml down",
    "generate": "turbo run generate"
  }
}
```

---

🚀 **"Sketch Together, Think Better."**
