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
