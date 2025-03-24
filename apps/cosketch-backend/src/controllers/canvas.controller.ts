import type { Response } from "express";
import { HttpStatus } from "../utils/HttpStatus";
import type { AuthRequest } from "../utils/request-type";

// ✅ Clear the canvas by deleting all designs for a specific room
export const clearCanvas = async (req: AuthRequest, res: Response) => {};

// ✅ Fetch all designs for a specific room
export const getCanvasDesigns = async (req: AuthRequest, res: Response) => {};
