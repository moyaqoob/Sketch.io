import express from "express";
import { auth } from "../middleware/auth";

import {
  // clearCanvas,
  getCanvasDesigns,
} from "../controllers/canvas.controller";

const router = express.Router();

router.use(auth);

// router.post("/clear-canvas", clearCanvas);
router.get("/get-canvas-design/:roomId", getCanvasDesigns);

export default router;
