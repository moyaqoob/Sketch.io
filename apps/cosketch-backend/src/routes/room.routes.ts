import expres from "express";
import {
  createRoom,
  joinRoom,
  leaveRoom,
} from "../controllers/room.controller";

const router = expres.Router();

router.post("/create-room", createRoom);
router.post("/join-room", joinRoom);
router.post("/leave-room", leaveRoom);

export default router;
