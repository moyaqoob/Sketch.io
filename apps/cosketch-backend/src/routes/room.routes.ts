import express from "express";
import {
  CreateRoom,
  joinRoom,
  leaveRoom,
  getRooms,
  VerifyUserInRoom,
} from "../controllers/room.controller";

import { auth } from "../middleware/auth";

const roomRouter = express.Router();

roomRouter.use(auth);

roomRouter.post("/create-room", CreateRoom);
roomRouter.post("/join-room", joinRoom);
roomRouter.post("/leave-or-delete", leaveRoom);
roomRouter.post("/verify", VerifyUserInRoom);

roomRouter.get("/rooms", getRooms);

export default roomRouter;
