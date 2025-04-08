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
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
  shape: z.any(),
  rotation: z.number().optional(),
  path: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
});

// Message schema
export const canvasMessageSchema = z.object({
  type: z.enum([
    "canvas:draw",
    "canvas:clear",
    "canvas:update",
    "canvas:erase",
  ]),
  room: z.string(),
  data: shapeSchema,
});

// Infer types
export type Shape = z.infer<typeof shapeSchema>;
export type CanvasMessage = z.infer<typeof canvasMessageSchema>;
