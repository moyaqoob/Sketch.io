import { Shape } from './draw.v2';

export class Eraser {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private shapes: Shape[];
  private eraserSize: number = 20;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    shapes: Shape[],
  ) {
    this.canvas = canvas;
    this.context = context;
    this.shapes = shapes;
  }

  /**
   * Erases shapes that intersect with the eraser
   */
  public erase(x: number, y: number): Shape[] {
    const remainingShapes: Shape[] = [];

    for (const shape of this.shapes) {
      if (!this.isShapeIntersectingEraser(shape, x, y)) {
        remainingShapes.push(shape);
      }
    }

    return remainingShapes;
  }

  /**
   * Checks if a shape intersects with the eraser
   */
  private isShapeIntersectingEraser(
    shape: Shape,
    x: number,
    y: number,
  ): boolean {
    switch (shape.type) {
      case 'Rectangle':
      case 'Diamond':
        return this.isPointInRect(x, y, shape);
      case 'Ellipse':
        return this.isPointInEllipse(x, y, shape);
      case 'Line':
      case 'Arrow':
        return this.isPointNearLine(x, y, shape);
      default:
        return false;
    }
  }

  /**
   * Checks if a point is inside a rectangle or diamond
   */
  private isPointInRect(x: number, y: number, shape: Shape): boolean {
    const minX = Math.min(shape.x1, shape.x2);
    const maxX = Math.max(shape.x1, shape.x2);
    const minY = Math.min(shape.y1, shape.y2);
    const maxY = Math.max(shape.y1, shape.y2);

    // Check if point is within eraser radius of the shape's boundaries
    return (
      x >= minX - this.eraserSize &&
      x <= maxX + this.eraserSize &&
      y >= minY - this.eraserSize &&
      y <= maxY + this.eraserSize
    );
  }

  /**
   * Checks if a point is inside an ellipse
   */
  private isPointInEllipse(x: number, y: number, shape: Shape): boolean {
    const centerX = (shape.x1 + shape.x2) / 2;
    const centerY = (shape.y1 + shape.y2) / 2;
    const radiusX = Math.abs(shape.x2 - shape.x1) / 2;
    const radiusY = Math.abs(shape.y2 - shape.y1) / 2;

    // Check if point is within eraser radius of the ellipse
    const dx = x - centerX;
    const dy = y - centerY;
    return (
      (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1.5
    );
  }

  /**
   * Checks if a point is near a line or arrow
   */
  private isPointNearLine(x: number, y: number, shape: Shape): boolean {
    const x1 = shape.x1;
    const y1 = shape.y1;
    const x2 = shape.x2;
    const y2 = shape.y2;

    // Calculate distance from point to line
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) {
      param = dot / len_sq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy) <= this.eraserSize;
  }
}
