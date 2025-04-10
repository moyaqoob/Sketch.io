import { z } from "zod";

/* --------------------- Tool Types --------------------- */
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

/* --------------------- Shape Options --------------------- */
export const shapeOptionsSchema = z.object({
  roughness: z.enum(["none", "normal", "high"]),
  strokeStyle: z.enum(["solid", "dashed", "dotted"]),
  strokeWidth: z.enum(["thin", "medium", "thick"]),
  fillStyle: z.enum(["hachure", "solid", "cross-hatch"]),
  fillColor: z.string(),
  strokeColor: z.string(),
  seed: z.number(),
});

export type ShapeOptions = z.infer<typeof shapeOptionsSchema>;

/* --------------------- Shape Schema --------------------- */
export const shapeSchema = z.object({
  id: z.string(),
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

export type Shape = z.infer<typeof shapeSchema>;

/* --------------------- Incoming Canvas Message (from frontend) --------------------- */
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

export type CanvasMessage = z.infer<typeof canvasMessageSchema>;

/* --------------------- Broadcast Message (to frontend) --------------------- */
export type BroadcastMessage =
  | {
      type: "canvas:draw";
      userId: string;
      data: Shape;
    }
  | {
      type: "canvas:update";
      userId: string;
      shapeId: string | number;
      data: Shape;
    }
  | {
      type: "canvas:erase";
      userId: string;
      shapeId: string | number;
    }
  | {
      type: "canvas:clear";
      message: string;
    };
