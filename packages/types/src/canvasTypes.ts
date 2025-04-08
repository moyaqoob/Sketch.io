import { z } from "zod";

// Tool/Shape types
export const shapeTypes = [
  "Rectangle",
  "Diamond",
  "Ellipse",
  "Arrow",
  "Line",
  "FreeDraw",
  "Text",
  "Selection",
  "Eraser",
] as const;

export type Tool = (typeof shapeTypes)[number];

// Style options for shapes
export const shapeOptionsSchema = z.object({
  roughness: z.enum(["none", "normal", "high"]),
  strokeStyle: z.enum(["solid", "dashed", "dotted"]),
  strokeWidth: z.enum(["thin", "medium", "thick"]),
  fillStyle: z.enum(["hachure", "solid", "cross-hatch"]),
  fillColor: z.string(),
  strokeColor: z.string(),
  seed: z.number(),
});

// Shape schema
export const shapeSchema = z.object({
  id: z.union([z.string(), z.number()]),
  type: z.enum(shapeTypes),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
  rotation: z.number().optional(),
  paths: z.array(z.tuple([z.number(), z.number()])).optional(),
  path: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
  options: shapeOptionsSchema,
});

// Canvas message schema
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
export type ShapeOptions = z.infer<typeof shapeOptionsSchema>;
export type Shape = z.infer<typeof shapeSchema>;
export type CanvasMessage = z.infer<typeof canvasMessageSchema>;
