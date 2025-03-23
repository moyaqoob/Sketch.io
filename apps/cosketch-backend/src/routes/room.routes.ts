import express from "express";
import {
  CreateRoom,
  joinRoom,
  leaveRoom,
  getRooms,
} from "../controllers/room.controller";

import { auth } from "../middleware/auth";

const router = express.Router();

router.use(auth);

router.post("/create-room", CreateRoom);
router.post("/join-room/:roomId", joinRoom);
router.post("/leave-or-delete", leaveRoom);

router.get("/rooms", getRooms);

export default router;
