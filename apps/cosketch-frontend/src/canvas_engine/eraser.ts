import { Shape } from './draw.v2';

export class Eraser {
  // private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private shapes: Shape[];
  private eraserSize: number = 20;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    shapes: Shape[],
  ) {
    // this.canvas = canvas;
    this.context = context;
    this.shapes = shapes;
  }

  /**
   * Sets the eraser size
   */
  public setEraserSize(size: number): void {
    this.eraserSize = size;
  }

  /**
   * Erases shapes that intersect with the eraser
   */
  public erase(x: number, y: number): Shape[] {
    const remainingShapes: Shape[] = [];

    for (const shape of this.shapes) {
      if (!this.isPointOnShape(shape, x, y)) {
        remainingShapes.push(shape); // only keep shapes not touched by eraser
      }
    }

    return remainingShapes;
  }

  /**
   * Checks if a point is on a shape's stroke
   */
  private isPointOnShape(shape: Shape, x: number, y: number): boolean {
    // Apply rotation if the shape has rotation
    if (shape.rotation) {
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;

      // Transform point to account for shape rotation
      const rotatedPoint = this.rotatePoint(
        x,
        y,
        centerX,
        centerY,
        -shape.rotation,
      );
      x = rotatedPoint.x;
      y = rotatedPoint.y;
    }

    this.context.save();

    // Use a larger line width to make erasing easier
    this.context.lineWidth = this.eraserSize;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.beginPath();

    switch (shape.type) {
      case 'Rectangle':
        this.drawRectanglePath(shape);
        break;
      case 'Diamond':
        this.drawDiamondPath(shape);
        break;
      case 'Ellipse':
        this.drawEllipsePath(shape);
        break;
      case 'Line':
        this.drawLinePath(shape);
        break;
      case 'Arrow':
        this.drawArrowPath(shape);
        break;
      default:
        this.context.restore();
        return false;
    }

    // Stroke to build the path for checking
    this.context.stroke();

    // Check if the point is on the stroke or inside the fill area
    const isOnStroke = this.context.isPointInStroke(x, y);
    const isInFill = this.context.isPointInPath(x, y);

    this.context.restore();

    return isOnStroke || isInFill;
  }

  /**
   * Rotates a point around a center by a given angle in degrees
   */
  private rotatePoint(
    x: number,
    y: number,
    cx: number,
    cy: number,
    angleDegrees: number,
  ): { x: number; y: number } {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);

    // Translate point to origin
    const nx = x - cx;
    const ny = y - cy;

    // Rotate point
    const rotatedX = nx * cos - ny * sin;
    const rotatedY = nx * sin + ny * cos;

    // Translate point back
    return {
      x: rotatedX + cx,
      y: rotatedY + cy,
    };
  }

  private drawRectanglePath(shape: Shape): void {
    const minX = Math.min(shape.x1, shape.x2);
    const minY = Math.min(shape.y1, shape.y2);
    const width = Math.abs(shape.x2 - shape.x1);
    const height = Math.abs(shape.y2 - shape.y1);

    this.context.rect(minX, minY, width, height);
  }

  private drawDiamondPath(shape: Shape): void {
    const centerX = (shape.x1 + shape.x2) / 2;
    const centerY = (shape.y1 + shape.y2) / 2;
    const width = Math.abs(shape.x2 - shape.x1);
    const height = Math.abs(shape.y2 - shape.y1);

    this.context.moveTo(centerX, centerY - height / 2);
    this.context.lineTo(centerX + width / 2, centerY);
    this.context.lineTo(centerX, centerY + height / 2);
    this.context.lineTo(centerX - width / 2, centerY);
    this.context.closePath();
  }

  private drawEllipsePath(shape: Shape): void {
    const centerX = (shape.x1 + shape.x2) / 2;
    const centerY = (shape.y1 + shape.y2) / 2;
    const radiusX = Math.abs(shape.x2 - shape.x1) / 2;
    const radiusY = Math.abs(shape.y2 - shape.y1) / 2;

    this.context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  }

  private drawLinePath(shape: Shape): void {
    this.context.moveTo(shape.x1, shape.y1);
    this.context.lineTo(shape.x2, shape.y2);
  }

  private drawArrowPath(shape: Shape): void {
    // Draw the main line
    this.context.moveTo(shape.x1, shape.y1);
    this.context.lineTo(shape.x2, shape.y2);

    // Calculate and draw arrowhead
    const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
    const arrowSize = 10;

    const arrowLeftX = shape.x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowLeftY = shape.y2 - arrowSize * Math.sin(angle - Math.PI / 6);

    const arrowRightX = shape.x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowRightY = shape.y2 - arrowSize * Math.sin(angle + Math.PI / 6);

    // Draw the left part of the arrowhead
    this.context.moveTo(shape.x2, shape.y2);
    this.context.lineTo(arrowLeftX, arrowLeftY);

    // Draw the right part of the arrowhead
    this.context.moveTo(shape.x2, shape.y2);
    this.context.lineTo(arrowRightX, arrowRightY);
  }
}
