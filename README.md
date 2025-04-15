# CoSketch

![CoSketch banner](https://github.com/NarsiBhati-Dev/CoSketch/blob/master/apps/cosketch-frontend/public/images/social-banner-4.jpeg?raw=true)

CoSketch is a **real-time collaborative drawing application** built using **Turborepo** and **Bun**. It includes separate apps for the frontend, backend API, and WebSocket server to enable seamless collaboration.

<!-- ## 🎬 CoSketch Demo -->

<video width="100%" controls style="border-radius: 6px;">
  <source src="https://github.com/NarsiBhati-Dev/CoSketch/blob/master/apps/cosketch-frontend/public/COSKETCH.mp4?raw=true" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md) to help keep **CoSketch** a welcoming and inclusive space for everyone

## License

This project is licensed under the [CoSketch Custom License](./LICENSE.md).

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

## 🧩 Features

CoSketch offers a rich set of features for real-time collaborative sketching:

- 🎨 **Shape Drawing**  
  Supports essential diagramming shapes:

  - Rectangle
  - Ellipse
  - Diamond
  - Arrow
  - Line

- ✏️ **Freehand Drawing**

  - Draw freehand lines with customizable brush sizes and colors.

- 📝 **Text Support**

  - Add text labels to your canvas with customizable colors.

- ✏️ **Interactive Editing**

  - Select, drag, and resize shapes with ease.
  - Modify shape styles including color, stroke width, and fill.

- 🗑️ **Shape Management**

  - Delete individual shapes.
  - Clear the entire canvas with one click.

- 🔄 **Real-Time Synchronization**

  - Update and broadcast shape and drawing state across all users using **WebSockets**.

- 🌐 **Multi-User Collaboration**

  - Seamless live editing experience for multiple participants.

- ☁️ **Persistent Storage**

  - Store and retrieve all shapes and drawings from a **PostgreSQL** database via **Prisma ORM**.

- ⚙️ **Modular Architecture**

  - Built with a scalable monorepo structure using **Turborepo** and **Bun**.
  - Decoupled apps for frontend, backend, and WebSocket server.

---

## 🚀 Getting Started

Follow these steps to get **CoSketch** up and running locally:

### 1️⃣ Install Dependencies

Make sure you have **Bun** installed globally, then install all packages:

```sh
bun install
```

### 2️⃣ Start the PostgreSQL Database

Ensure Docker is installed and running, then start the database:

```sh
bun run db:up
```

This uses the docker-compose.yml file to spin up a PostgreSQL container.

### 3️⃣ Generate Prisma Client

```sh
bun run generate
```

This command generates the Prisma client across all apps using the shared database package.

### 4️⃣ Configure Environment Variables

Copy the example environment files and rename them to .env in each app:

```sh
cp apps/cosketch-backend/.env.example apps/cosketch-backend/.env
cp apps/cosketch-frontend/.env.example apps/cosketch-frontend/.env
cp apps/cosketch-websocket/.env.example apps/cosketch-websocket/.env
```

Fill in the required values like DATABASE_URL, NEXT_PUBLIC_WS_URL, etc.

### 5️⃣ Run the App (Monorepo Style)

To start all apps together using Turborepo:

```sh
bun run dev
```

### 🔧 Or Start Individual Apps

You can run apps individually if needed:

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
