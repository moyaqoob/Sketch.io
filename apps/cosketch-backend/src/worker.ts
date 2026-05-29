import { Hono } from "hono";
import { cors } from "hono/cors";
import { verifyToken } from "@repo/backend-common/config";
import {
  connectUserWithRoom,
  createRoom,
  createUser,
  deleteRoom,
  getRoomByName,
  getRoomByRoomId,
  getRoomCanvas,
  getRoomsByUserId,
  getRoomWithUsers,
  getRoomWithUsersById,
  getUserByEmail,
  getUserById,
  initDatabase,
  removeUserFromRoom,
} from "@repo/database";
import { CreateRoomSchema, CreateUserSchema, shapeSchema, SigninSchema } from "@repo/types";
import { hashPassword, verifyPassword } from "./utils/bcrypt";
import { HttpStatus } from "./utils/HttpStatus";
import { generateToken } from "./utils/jwt";

export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  FRONTEND_URL?: string;
}

type AppEnv = { Bindings: Env };

const app = new Hono<AppEnv>();

app.use("*", async (c, next) => {
  initDatabase(c.env.DATABASE_URL);
  process.env.JWT_SECRET = c.env.JWT_SECRET;
  await next();
});

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const allowed = [
        "http://localhost:3000",
        "http://localhost:3001",
        ...(c.env.FRONTEND_URL ? [c.env.FRONTEND_URL.replace(/\/$/, "")] : []),
      ];
      if (!origin || allowed.includes(origin)) {
        return origin ?? allowed[0];
      }
      return allowed[0];
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

function authUserId(c: { req: { header: (name: string) => string | undefined }; env: Env }) {
  const token = c.req.header("authorization")?.split(" ")[1];
  if (!token) return null;
  return verifyToken(token, c.env.JWT_SECRET)?.id ?? null;
}

app.get("/", (c) =>
  c.json({ success: true, message: "Welcome to Sketch.io!" }),
);

app.post("/auth/test", (c) =>
  c.json({ success: "true", message: "the test has passed" }),
);

app.post("/auth/signup", async (c) => {
  const parsedData = CreateUserSchema.safeParse(await c.req.json());
  if (!parsedData.success) {
    return c.json(
      { success: false, error: parsedData.error.errors },
      HttpStatus.BAD_REQUEST,
    );
  }

  const { email, password, name } = parsedData.data;
  const userExist = await getUserByEmail(email);
  if (userExist) {
    return c.json(
      { success: false, error: "Username already taken" },
      HttpStatus.BAD_REQUEST,
    );
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await createUser(email, hashedPassword, name);
  return c.json(
    { success: true, message: "User created successfully", user: newUser },
    HttpStatus.CREATED,
  );
});

app.post("/auth/signin", async (c) => {
  const parsedData = SigninSchema.safeParse(await c.req.json());
  if (!parsedData.success) {
    return c.json(
      { success: false, error: parsedData.error.errors },
      HttpStatus.BAD_REQUEST,
    );
  }

  const { email, password } = parsedData.data;
  const user = await getUserByEmail(email);
  if (!user) {
    return c.json(
      { success: false, error: "Invalid email or password" },
      HttpStatus.UNAUTHORIZED,
    );
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return c.json(
      { success: false, error: "Invalid email or password" },
      HttpStatus.UNAUTHORIZED,
    );
  }

  const token = generateToken(user.id);
  return c.json({ success: true, message: "Signin successful", token });
});

app.get("/auth/me", async (c) => {
  const userId = authUserId(c);
  if (!userId) {
    return c.json({ success: false, error: "Unauthorized: No user ID found" }, 401);
  }

  const user = await getUserById(userId);
  if (!user) {
    return c.json({ success: false, error: "User not found" }, HttpStatus.NOT_FOUND);
  }

  return c.json({
    success: true,
    message: `Welcome ${user.name}`,
    name: user.name,
  });
});

app.post("/room/create-room", async (c) => {
  const userId = authUserId(c);
  if (!userId) {
    return c.json({ success: false, error: "User authentication failed." }, 401);
  }

  const parsedData = CreateRoomSchema.safeParse(await c.req.json());
  if (!parsedData.success) {
    return c.json({ success: false, error: "Invalid Room Name" }, HttpStatus.BAD_REQUEST);
  }

  const { roomName } = parsedData.data;
  const existingRoom = await getRoomByName(roomName);
  if (existingRoom) {
    return c.json({ success: false, error: "Room already exists" }, HttpStatus.CONFLICT);
  }

  const room = await createRoom(roomName, userId);
  if (!room) {
    return c.json(
      { success: false, error: "Failed to create the room. Please try again later." },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return c.json(
    { success: true, message: "Room Created Successfully", roomId: room.id, slug: room.slug },
    HttpStatus.CREATED,
  );
});

app.post("/room/join-room", async (c) => {
  const userId = authUserId(c);
  if (!userId) {
    return c.json({ success: false, error: "User not authenticated. Please log in." }, 401);
  }

  const { roomId } = await c.req.json<{ roomId?: string }>();
  if (!roomId) {
    return c.json({ success: false, error: "Room ID is required." }, HttpStatus.BAD_REQUEST);
  }

  const room = await getRoomWithUsers(roomId);
  if (!room) {
    return c.json({ success: false, error: "Room doesn't exist" }, HttpStatus.NOT_FOUND);
  }

  const isAlreadyMember = room.users.some((user) => user.id === userId);
  if (!isAlreadyMember) {
    await connectUserWithRoom(roomId, userId);
  }

  return c.json({ success: true, message: "Room joined successfully.", roomId });
});

app.post("/room/verify", async (c) => {
  const userId = authUserId(c);
  if (!userId) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const { roomId } = await c.req.json<{ roomId?: string }>();
  if (!roomId) {
    return c.json({ success: false, message: "Room ID required" }, HttpStatus.BAD_REQUEST);
  }

  const room = await getRoomByRoomId(roomId);
  if (!room) {
    return c.json({ message: "Room not found" }, HttpStatus.NOT_FOUND);
  }

  const isUserInRoom = room.users.some((user) => user.id === userId);
  if (!isUserInRoom) {
    return c.json({ message: "Access denied. Not in this room." }, 403);
  }

  return c.json({ success: true, message: "User is in the room" });
});

app.post("/room/leave-or-delete", async (c) => {
  const userId = authUserId(c);
  if (!userId) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const { roomId } = await c.req.json<{ roomId?: string }>();
  if (!roomId) {
    return c.json({ success: false, message: "Room ID required" }, HttpStatus.BAD_REQUEST);
  }

  const room = await getRoomWithUsersById(roomId);
  if (!room) {
    return c.json({ success: false, message: "Room not found." }, HttpStatus.NOT_FOUND);
  }

  if (room.adminId === userId) {
    await deleteRoom(roomId);
    return c.json({ success: true, message: "Room deleted." });
  }

  await removeUserFromRoom(roomId, userId);
  return c.json({ success: true, message: "Left the room." });
});

app.get("/room/rooms", async (c) => {
  const userId = authUserId(c);
  if (!userId) {
    return c.json({ success: false, error: "User authentication failed." }, 401);
  }

  const user = await getRoomsByUserId(userId);
  if (!user) {
    return c.json({ success: false, error: "User not found." }, HttpStatus.NOT_FOUND);
  }

  if (!user.rooms?.length) {
    return c.json({
      success: true,
      message: "No rooms available.",
      data: { userName: user.name, rooms: [] },
    });
  }

  const formattedRooms = user.rooms.map((room) => ({
    roomId: room.id,
    slug: room.slug,
    createdAt: room.createdAt,
    participants: room.users.map((participant) => participant.name),
    noOfParticipants: room.users.length,
  }));

  return c.json({
    success: true,
    message: "Rooms fetched successfully.",
    data: { userName: user.name, rooms: formattedRooms },
  });
});

app.get("/canvas/get-canvas-design/:roomId", async (c) => {
  const userId = authUserId(c);
  if (!userId) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const roomId = c.req.param("roomId");
  if (!roomId) {
    return c.json({ success: false, message: "Room ID required" }, HttpStatus.BAD_REQUEST);
  }

  const designs = await getRoomCanvas(roomId);
  const Shapes = designs
    .map((d) => shapeSchema.safeParse(d.design))
    .filter((parsed) => parsed.success)
    .map((parsed) => parsed.data);

  return c.json({ success: true, Shapes });
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ success: false, error: "Internal server error" }, 500);
});

export default app;
