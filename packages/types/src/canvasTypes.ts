import { z } from "zod";

// Shape types
export const shapeTypes = [
  "Rectangle",
  "Diamond",
  "Ellipse",
  "Arrow",
  "Line",
  "FreeDraw",
  "Text",
] as const;

// Shape schema
export const shapeSchema = z.object({
  id: z.number().optional(),
  type: z.enum(shapeTypes),
  startX: z.number(),
  startY: z.number(),
  endX: z.number().optional(),
  endY: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  size: z.number().optional(),
  stroke: z.string(),
  roughness: z.number(),
});

// Message schema
export const canvasMessageSchema = z.object({
  type: z.enum(["draw_canvas", "clear_canvas", "update", "erase"]),
  room: z.string(),
  data: shapeSchema,
});

// Infer types
export type Shape = z.infer<typeof shapeSchema>;
export type CanvasMessage = z.infer<typeof canvasMessageSchema>;
