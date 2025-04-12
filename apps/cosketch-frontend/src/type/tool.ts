export type Tool =
  | 'Selection'
  | 'Rectangle'
  | 'Diamond'
  | 'Ellipse'
  | 'Arrow'
  | 'Line'
  | 'Freehand'
  | 'Text'
  | 'Eraser';

/**
 * Style options interface for shape appearance
 */
export interface ShapeOptions {
  roughness: 'none' | 'normal' | 'high';
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  strokeWidth: 'thin' | 'medium' | 'thick';
  fillStyle: 'hachure' | 'solid' | 'cross-hatch';
  fillColor: string;
  strokeColor: string;
  seed: number;
}

/**
 * Represents a shape on the canvas with its properties
 */
export interface Shape {
  id: string;
  type: Tool;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  rotation?: number;
  paths?: [number, number][];
  options: ShapeOptions;
}
