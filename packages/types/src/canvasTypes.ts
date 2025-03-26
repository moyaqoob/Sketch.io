import { z } from "zod";

// Define shape schema
export const shapeSchema = z.object({
  id: z.number().optional(),
  type: z.enum(["circle", "rectangle", "line"]),
  x: z.number(),
  y: z.number(),
  color: z.string(),
  radius: z.number().optional(), // Only for circles
  width: z.number().optional(), // Only for rectangles
  height: z.number().optional(), // Only for rectangles
  points: z.array(z.number()).optional(), // Only for lines
});

// The entire message schema
export const canvasMessageSchema = z.object({
  type: z.string(),
  room: z.string(),
  data: shapeSchema, // Data itself is a single shape
});

// **Infer TypeScript types from Zod schemas**
export type Shape = z.infer<typeof shapeSchema>;
export type CanvasMessage = z.infer<typeof canvasMessageSchema>;
