# CoSketch Backend

CoSketch Backend is the core API server for the **CoSketch** application, handling authentication, database interactions, and real-time updates. It is built using **Bun** for high performance and efficiency.

## 🚀 Getting Started

### 1️⃣ Install Dependencies

Ensure you have [Bun](https://bun.sh) installed, then run:

```sh
bun install
```

### 2️⃣ Run the Backend Server

Start the server using:

```sh
bun run index.ts
```

For development with file watching:

```sh
bun run --watch index.ts
```

Or simply:

```sh
bun run dev
```

### 3️⃣ Project Structure

```sh
co-sketch-backend/
├── src/
│   ├── routes/       # API routes
│   ├── controllers/  # Business logic
│   ├── models/       # Database models
│   ├── middleware/   # Authentication & validation
│   ├── index.ts      # Entry point
├── package.json      # Project metadata & scripts
├── bun.lockb         # Bun lock file
└── README.md         # Documentation
```

## 📦 Tech Stack

- **Bun** → Fast JavaScript runtime
- **Express** → Backend framework
- **PostgreSQL** → Data storage

## 📜 Scripts (package.json)

```json
{
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "start": "bun run src/index.ts"
  }
}
```

## 🔧 To-Do

- [ ] Implement authentication
- [ ] Add database models & API endpoints

---

🚀 **"Sketch Together, Think Better."**
