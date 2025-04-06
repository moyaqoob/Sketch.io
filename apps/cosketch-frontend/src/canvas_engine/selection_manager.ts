import { Shape } from './draw.v2';

// Types of resize handles available for shapes
type ResizeHandle =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left';

/**
 * Manages shape selection, movement, and resizing on the canvas
 */
export class SelectionManager {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private selectedShape: Shape | null = null; // Currently selected shape

  private isDragging = false; // Whether a shape is being dragged
  private isResizing = false; // Whether a shape is being resized
  private activeHandle: ResizeHandle | null = null; // Current resize handle being used

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  /**
   * Checks if a point (x,y) is inside a given shape
   * Handles different shape types (Rectangle, Diamond, Ellipse, Line, Arrow)
   */
  private isPointInsideShape(shape: Shape, x: number, y: number): boolean {
    switch (shape.type) {
      case 'Rectangle':
      case 'Diamond':
        return (
          x >= Math.min(shape.x1, shape.x2) &&
          x <= Math.max(shape.x1, shape.x2) &&
          y >= Math.min(shape.y1, shape.y2) &&
          y <= Math.max(shape.y1, shape.y2)
        );
      case 'Ellipse': {
        const cx = (shape.x1 + shape.x2) / 2;
        const cy = (shape.y1 + shape.y2) / 2;
        const rx = Math.abs(shape.x2 - shape.x1) / 2;
        const ry = Math.abs(shape.y2 - shape.y1) / 2;
        return (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 <= 1;
      }
      case 'Line':
      case 'Arrow':
        return this.isPointNearLine(
          shape.x1,
          shape.y1,
          shape.x2,
          shape.y2,
          x,
          y,
        );
      default:
        return false;
    }
  }

  /**
   * Checks if a point is near a line segment
   * Used for line and arrow selection
   */
  private isPointNearLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    px: number,
    py: number,
  ): boolean {
    const threshold = 5;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) return false;

    const t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
    if (t < 0 || t > 1) return false;

    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    return Math.hypot(closestX - px, closestY - py) <= threshold;
  }

  /**
   * Returns the positions of all resize handles for a shape
   * Includes corner and edge handles
   */
  private getResizeHandles(
    shape: Shape,
  ): Record<ResizeHandle, { x: number; y: number }> {
    const { x1, y1, x2, y2 } = shape;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return {
      'top-left': { x: x1, y: y1 },
      top: { x: midX, y: y1 },
      'top-right': { x: x2, y: y1 },
      right: { x: x2, y: midY },
      'bottom-right': { x: x2, y: y2 },
      bottom: { x: midX, y: y2 },
      'bottom-left': { x: x1, y: y2 },
      left: { x: x1, y: midY },
    };
  }

  /**
   * Finds which resize handle (if any) is at the given point
   */
  public getResizeHandleAtPoint(x: number, y: number): ResizeHandle | null {
    if (!this.selectedShape) return null;
    const handles = this.getResizeHandles(this.selectedShape);
    for (const [name, pos] of Object.entries(handles) as [
      ResizeHandle,
      { x: number; y: number },
    ][]) {
      if (Math.abs(x - pos.x) <= 6 && Math.abs(y - pos.y) <= 6) return name;
    }
    return null;
  }

  /**
   * Finds which shape (if any) is at the given point
   * Returns the topmost shape at that position
   */
  public getShapeAtPoint(x: number, y: number, shapes: Shape[]): Shape | null {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (this.isPointInsideShape(shape, x, y)) {
        this.selectedShape = shape;
        shapes.splice(i, 1);
        shapes.push(shape);
        return shape;
      }
    }
    this.selectedShape = null;
    return null;
  }

  /**
   * Gets the currently selected shape
   */
  public getSelectedShape(): Shape | null {
    return this.selectedShape;
  }

  /**
   * Sets the currently selected shape
   */
  public setSelectedShape(shape: Shape | null) {
    this.selectedShape = shape;
  }

  /**
   * Starts dragging a shape
   */
  public beginDrag(x1?: number, y1?: number) {
    this.isDragging = true;
  }

  /**
   * Updates shape position during dragging
   */
  public updateDrag(deltaX: number, deltaY: number) {
    if (!this.selectedShape || !this.isDragging) return;
    this.selectedShape.x1 += deltaX;
    this.selectedShape.y1 += deltaY;
    this.selectedShape.x2 += deltaX;
    this.selectedShape.y2 += deltaY;
  }

  /**
   * Ends dragging operation
   */
  public endDrag() {
    this.isDragging = false;
  }

  /**
   * Starts resizing a shape from a specific handle
   */
  public beginResize(handle: ResizeHandle) {
    this.isResizing = true;
    this.activeHandle = handle;
  }

  /**
   * Updates shape size during resizing
   * Handles different resize handles (corners and edges)
   */
  public updateResize(deltaX: number, deltaY: number) {
    if (!this.selectedShape || !this.isResizing || !this.activeHandle) return;

    const shape = this.selectedShape;
    switch (this.activeHandle) {
      case 'top-left':
        shape.x1 += deltaX;
        shape.y1 += deltaY;
        break;
      case 'top':
        shape.y1 += deltaY;
        break;
      case 'top-right':
        shape.x2 += deltaX;
        shape.y1 += deltaY;
        break;
      case 'right':
        shape.x2 += deltaX;
        break;
      case 'bottom-right':
        shape.x2 += deltaX;
        shape.y2 += deltaY;
        break;
      case 'bottom':
        shape.y2 += deltaY;
        break;
      case 'bottom-left':
        shape.x1 += deltaX;
        shape.y2 += deltaY;
        break;
      case 'left':
        shape.x1 += deltaX;
        break;
    }

    this.ensureMinimumSize(shape);
  }

  /**
   * Ends resizing operation
   */
  public endResize() {
    this.isResizing = false;
    this.activeHandle = null;
  }

  /**
   * Draws the selection outline around a shape
   * Includes resize handles and proper padding
   */
  public drawSelectionOutline(shape: Shape) {
    const { x1, y1, x2, y2 } = shape;
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    this.context.save();

    // Draw selection rectangle
    this.context.strokeStyle = '#625ee0';
    this.context.lineWidth = 2;
    this.context.setLineDash([]);

    if (shape.type === 'Line' || shape.type === 'Arrow') {
      // For lines and arrows, draw a selection box around the line
      const padding = 12;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const perpendicular = angle + Math.PI / 2;

      const points = [
        [
          x1 + padding * Math.cos(perpendicular),
          y1 + padding * Math.sin(perpendicular),
        ],
        [
          x2 + padding * Math.cos(perpendicular),
          y2 + padding * Math.sin(perpendicular),
        ],
        [
          x2 - padding * Math.cos(perpendicular),
          y2 - padding * Math.sin(perpendicular),
        ],
        [
          x1 - padding * Math.cos(perpendicular),
          y1 - padding * Math.sin(perpendicular),
        ],
      ];

      this.context.beginPath();
      this.context.moveTo(points[0][0], points[0][1]);
      points.forEach(point => this.context.lineTo(point[0], point[1]));
      this.context.closePath();
      this.context.stroke();
    } else {
      // For other shapes, draw a rectangular selection box with padding
      const padding = 8;
      this.context.strokeRect(
        minX - padding,
        minY - padding,
        width + padding * 2,
        height + padding * 2,
      );
    }

    // Draw resize handles
    const handles = this.getResizeHandles(shape);
    for (const pos of Object.values(handles)) {
      this.context.beginPath();
      this.context.rect(pos.x - 4, pos.y - 4, 8, 8);
      this.context.fillStyle = '#625ee0';
      this.context.fill();
      this.context.strokeStyle = '#625ee0';
      this.context.stroke();
    }

    this.context.restore();
  }

  /**
   * Updates cursor style based on current interaction
   * Shows resize cursors when over handles, move cursor when over shape
   */
  public updateCursor(x: number, y: number) {
    if (!this.selectedShape) {
      this.canvas.style.cursor = 'default';
      return;
    }

    const handle = this.getResizeHandleAtPoint(x, y);
    if (handle) {
      switch (handle) {
        case 'top-left':
        case 'bottom-right':
          this.canvas.style.cursor = 'nwse-resize';
          break;
        case 'top-right':
        case 'bottom-left':
          this.canvas.style.cursor = 'nesw-resize';
          break;
        case 'top':
        case 'bottom':
          this.canvas.style.cursor = 'ns-resize';
          break;
        case 'left':
        case 'right':
          this.canvas.style.cursor = 'ew-resize';
          break;
      }
    } else if (this.isPointInsideShape(this.selectedShape, x, y)) {
      this.canvas.style.cursor = 'move';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  /**
   * Ensures a shape doesn't get too small during resizing
   * Maintains minimum dimensions for better usability
   */
  private ensureMinimumSize(shape: Shape, minSize: number = 10): void {
    if (Math.abs(shape.x2 - shape.x1) < minSize) {
      if (shape.x2 > shape.x1) {
        shape.x2 = shape.x1 + minSize;
      } else {
        shape.x2 = shape.x1 - minSize;
      }
    }
    if (Math.abs(shape.y2 - shape.y1) < minSize) {
      if (shape.y2 > shape.y1) {
        shape.y2 = shape.y1 + minSize;
      } else {
        shape.y2 = shape.y1 - minSize;
      }
    }
  }
}
