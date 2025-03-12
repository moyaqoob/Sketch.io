# CoSketch

CoSketch is a **real-time collaborative drawing application** built using **Turborepo** and **Bun** as the package manager. It includes separate apps for the frontend, backend API, and WebSocket server to enable seamless collaboration.

## 🏗 Project Structure

This monorepo is managed using **Turborepo** and structured as follows:

```sh
cosketch/
├── apps/ # Contains independent applications
│ ├── frontend/ # Next.js app for the UI
│ ├── backend/ # Express backend for API handling
│ ├── websocket/ # WebSocket server for real-time collaboration
├── packages/ # Shared code across apps
│ ├── types/       # Shared TypeScript types
│ ├── ui/ # Shared UI components (e.g., buttons, modals)
│ ├── utils/ # Shared utility functions
├── turbo.json # Turborepo config file
├── package.json # Root package.json for Bun & Turborepo setup
└── README.md # Project documentation
```

## 🚀 Getting Started

### 1️⃣ Install Dependencies

Ensure **Bun** is installed on your system:

```sh
bun install
```

### 2️⃣ Run the Development Environment

Use Turborepo to start all apps simultaneously:

```sh
bun run dev
```

### 3️⃣ Running Individual Apps

You can start specific apps independently:

```sh
# Start frontend (Next.js)
bun run dev --filter=co-sketch-frontend

# Start backend (Express API)
bun run dev --filter=co-sketch-backend

# Start WebSocket server
bun run dev --filter=co-sketch-websocket
```

## 📦 Tech Stack

- **Turborepo** → Monorepo management
- **Bun** → Fast JavaScript package manager & runtime
- **Next.js** → Frontend framework
- **Express.js** → Backend API
- **WebSockets** → Real-time collaboration

## 📜 Scripts (Root Package.json)

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "format": "turbo format"
  }
}
```

## 🚧 To-Do

- [ ] Implement real-time drawing synchronization
- [ ] Add authentication system
- [ ] Optimize performance

🚀 **"Sketch Together, Think Better."**
