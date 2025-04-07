import { Shape } from './draw.v2';

export class Eraser {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private shapes: Shape[];
  private eraserSize: number = 5;

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
      if (!this.isPointOnShape(shape, x, y)) {
        remainingShapes.push(shape); // only keep if not touched
      }
    }

    return remainingShapes;
  }

  /**
   * Checks if a point is on a shape's stroke
   */
  private isPointOnShape(shape: Shape, x: number, y: number): boolean {
    this.context.save();
    this.context.lineWidth = this.eraserSize;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.beginPath();

    switch (shape.type) {
      case 'Rectangle':
        this.drawRectangle(shape);
        break;
      case 'Diamond':
        this.drawDiamond(shape);
        break;
      case 'Ellipse':
        this.drawEllipse(shape);
        break;
      case 'Line':
      case 'Arrow':
        this.drawLine(shape);
        break;
      default:
        this.context.restore();
        return false;
    }

    // Stroke to build the path for checking
    this.context.stroke();

    const isOnStroke = this.context.isPointInStroke(x, y);
    this.context.restore();
    return isOnStroke;
  }

  private drawRectangle(shape: Shape): void {
    const minX = Math.min(shape.x1, shape.x2);
    const minY = Math.min(shape.y1, shape.y2);
    const width = Math.abs(shape.x2 - shape.x1);
    const height = Math.abs(shape.y2 - shape.y1);

    this.context.rect(minX, minY, width, height);
  }

  private drawDiamond(shape: Shape): void {
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

  private drawEllipse(shape: Shape): void {
    const centerX = (shape.x1 + shape.x2) / 2;
    const centerY = (shape.y1 + shape.y2) / 2;
    const radiusX = Math.abs(shape.x2 - shape.x1) / 2;
    const radiusY = Math.abs(shape.y2 - shape.y1) / 2;

    this.context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  }

  private drawLine(shape: Shape): void {
    this.context.moveTo(shape.x1, shape.y1);
    this.context.lineTo(shape.x2, shape.y2);
  }
}
