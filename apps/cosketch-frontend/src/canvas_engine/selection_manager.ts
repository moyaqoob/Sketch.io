import { Tool } from '@/type/tool';
import { Shape } from './draw.v2';

export class SelectionManager {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private selectedShape: Tool | null = null;

  private isDragging: boolean = false;
  private isResizing: boolean = false;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  isPointInsideShape(Shape: Shape) {}

  setSelectedShape(shape: Tool | null) {
    this.selectedShape = shape;
  }

  getSelectedShape() {
    return this.selectedShape;
  }

  private beginDrag() {}
  private beginResize() {}

  private updateDrag() {}
  private updateResize() {}

  private endDrag() {}
  private endResize() {}
}
