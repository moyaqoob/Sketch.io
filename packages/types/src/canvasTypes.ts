import { z } from "zod";

// shape
export const shapeTypes = [
  "Rectangle",
  "Diamond",
  "Circle",
  "Arrow",
  "Line",
  "FreeDraw",
  "Text",
] as const;

// Shape schema
export const shapeSchema = z.object({
  id: z.number().optional(),
  type: z.enum(shapeTypes),
  x: z.number(),
  y: z.number(),
  color: z.string(),
  opacity: z.number().min(0).max(1).optional(),
  strokeWidth: z.number().optional(),
  radius: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  text: z.string().optional(),
  points: z.array(z.number()).optional(),
});

// message schema
export const canvasMessageSchema = z.object({
  type: z.enum(["draw_canvas", "clear_canvas", "update", "erase"]),
  room: z.string(),
  data: shapeSchema,
});

// Infer types
export type Shape = z.infer<typeof shapeSchema>;
export type CanvasMessage = z.infer<typeof canvasMessageSchema>;
