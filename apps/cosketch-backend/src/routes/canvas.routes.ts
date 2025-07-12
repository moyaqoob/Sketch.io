import express from "express";
import { auth } from "../middleware/auth";

import { getCanvasDesigns } from "../controllers/canvas.controller";

const canvasRouter = express.Router();

canvasRouter.use(auth);

canvasRouter.get("/get-canvas-design/:roomId", getCanvasDesigns);

export default canvasRouter;
