import express from "express";
import { auth } from "../middleware/auth";

import {
  clearCanvas,
  getCanvasDesigns,
} from "../controllers/canvas.controller";

const router = express.Router();

router.post("/clear-canvas", clearCanvas);
router.post("/get-canvas-desgin", getCanvasDesigns);

router.use(auth);

export default router;
