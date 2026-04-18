import express, { type Request, type Response } from "express";
import cors from "cors";
import { PORT, FRONTEND_URL } from "./config/env";

// import routers
import authRouter from "./routes/auth.routes";
import roomRouter from "./routes/room.routes";
import canvasRouter from "./routes/canvas.routes";

const app = express();

// Origin must match the browser's `Origin` header exactly (no trailing slash).
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  ...(FRONTEND_URL ? [FRONTEND_URL.replace(/\/$/, "")] : []),
];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Sketch.io!",
  });
});

app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/canvas", canvasRouter);

app.listen(PORT, () => {
  console.log(`[ server ] is listening on : http://localhost:${PORT}`);
  
});
