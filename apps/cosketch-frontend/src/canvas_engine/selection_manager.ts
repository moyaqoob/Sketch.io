import { Shape } from '@repo/types';

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
 * Single selection only - no multi-selection functionality
 */
export class SelectionManager {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  // private socket: WebSocket;

  private selectedShape: Shape | null = null; // Currently selected shape

  private isDragging = false; // Whether a shape is being dragged
  private isResizing = false; // Whether a shape is being resized
  private isRotating = false; // Whether a shape is being rotated
  private activeHandle: ResizeHandle | null = null; // Current resize handle being used

  // For marquee selection
  private isMarqueeSelecting = false;
  private marqueeStartX = 0;
  private marqueeStartY = 0;
  private marqueeEndX = 0;
  private marqueeEndY = 0;

  // For rotation
  private rotationCenter = { x: 0, y: 0 };

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    // socket: WebSocket,
  ) {
    this.canvas = canvas;
    this.context = context;
    // this.socket = socket;
  }

  /**
   * Checks if a point (x,y) is inside a given shape
   * Handles different shape types (Rectangle, Diamond, Ellipse, Line, Arrow)
   */
  private isPointInsideShape(shape: Shape, x: number, y: number): boolean {
    // If shape is rotated, transform the point to un-rotated coordinates
    let transformedX = x;
    let transformedY = y;

    if (shape.rotation) {
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;

      // Convert rotation from degrees to radians (in reverse direction)
      const angleRad = -(shape.rotation * Math.PI) / 180;

      // Translate point to origin (center of shape)
      const translatedX = x - centerX;
      const translatedY = y - centerY;

      // Rotate point
      transformedX =
        centerX +
        translatedX * Math.cos(angleRad) -
        translatedY * Math.sin(angleRad);
      transformedY =
        centerY +
        translatedX * Math.sin(angleRad) +
        translatedY * Math.cos(angleRad);
    }

    // Now use the transformed coordinates for hit detection
    switch (shape.type) {
      case 'Rectangle':
        return (
          transformedX >= Math.min(shape.x1, shape.x2) &&
          transformedX <= Math.max(shape.x1, shape.x2) &&
          transformedY >= Math.min(shape.y1, shape.y2) &&
          transformedY <= Math.max(shape.y1, shape.y2)
        );
      case 'Diamond': {
        const centerX = (shape.x1 + shape.x2) / 2;
        const centerY = (shape.y1 + shape.y2) / 2;
        const width = Math.abs(shape.x2 - shape.x1);
        const height = Math.abs(shape.y2 - shape.y1);

        // Diamond equation
        return (
          Math.abs(transformedX - centerX) / (width / 2) +
            Math.abs(transformedY - centerY) / (height / 2) <=
          1
        );
      }
      case 'Ellipse': {
        const cx = (shape.x1 + shape.x2) / 2;
        const cy = (shape.y1 + shape.y2) / 2;
        const rx = Math.abs(shape.x2 - shape.x1) / 2;
        const ry = Math.abs(shape.y2 - shape.y1) / 2;
        return (
          (transformedX - cx) ** 2 / rx ** 2 +
            (transformedY - cy) ** 2 / ry ** 2 <=
          1
        );
      }
      case 'Line':
      case 'Arrow':
        return this.isPointNearLine(
          shape.x1,
          shape.y1,
          shape.x2,
          shape.y2,
          transformedX,
          transformedY,
        );
      default:
        return false;
    }
  }

  /**
   * Enhanced version of checking if a point is near a line segment
   * Uses improved distance calculation for better line selection experience
   */
  private isPointNearLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    px: number,
    py: number,
  ): boolean {
    const threshold = 8; // Increased threshold for easier selection
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) return false;

    // Calculate projection
    const t = Math.max(
      0,
      Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared),
    );
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    const distance = Math.hypot(closestX - px, closestY - py);

    return distance <= threshold;
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
      'top-left': { x: Math.min(x1, x2), y: Math.min(y1, y2) },
      top: { x: midX, y: Math.min(y1, y2) },
      'top-right': { x: Math.max(x1, x2), y: Math.min(y1, y2) },
      right: { x: Math.max(x1, x2), y: midY },
      'bottom-right': { x: Math.max(x1, x2), y: Math.max(y1, y2) },
      bottom: { x: midX, y: Math.max(y1, y2) },
      'bottom-left': { x: Math.min(x1, x2), y: Math.max(y1, y2) },
      left: { x: Math.min(x1, x2), y: midY },
    };
  }

  /**
   * Finds which resize handle (if any) is at the given point, accounting for rotation
   */
  public getResizeHandleAtPoint(x: number, y: number): ResizeHandle | null {
    if (!this.selectedShape) return null;

    const shape = this.selectedShape;
    const handles = this.getResizeHandles(shape);

    // If shape is rotated, transform the mouse coordinates
    let transformedX = x;
    let transformedY = y;

    if (shape.rotation) {
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;

      // Convert rotation from degrees to radians (in reverse direction)
      const angleRad = -(shape.rotation * Math.PI) / 180;

      // Translate point to origin (center of shape)
      const translatedX = x - centerX;
      const translatedY = y - centerY;

      // Rotate point
      transformedX =
        centerX +
        translatedX * Math.cos(angleRad) -
        translatedY * Math.sin(angleRad);
      transformedY =
        centerY +
        translatedX * Math.sin(angleRad) +
        translatedY * Math.cos(angleRad);
    }

    for (const [name, pos] of Object.entries(handles) as [
      ResizeHandle,
      { x: number; y: number },
    ][]) {
      if (
        Math.abs(transformedX - pos.x) <= 6 &&
        Math.abs(transformedY - pos.y) <= 6
      )
        return name;
    }

    return null;
  }

  /**
   * Gets the rotation handle position for a shape
   */
  private getRotationHandle(shape: Shape): { x: number; y: number } {
    const centerX = (shape.x1 + shape.x2) / 2;
    // const centerY = (shape.y1 + shape.y2) / 2;
    const minY = Math.min(shape.y1, shape.y2);

    // Place rotation handle above the shape
    return {
      x: centerX,
      y: minY - 25,
    };
  }

  /**
   * Checks if a point is near the rotation handle, accounting for shape rotation
   */
  public isNearRotationHandle(x: number, y: number): boolean {
    if (!this.selectedShape) return false;

    const shape = this.selectedShape;
    const handle = this.getRotationHandle(shape);

    // If shape is rotated, we need to transform the mouse coordinates
    if (shape.rotation) {
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;

      // Convert rotation from degrees to radians (in reverse direction)
      const angleRad = -(shape.rotation * Math.PI) / 180;

      // Translate point to origin (center of shape)
      const translatedX = x - centerX;
      const translatedY = y - centerY;

      // Rotate point
      const rotatedX =
        translatedX * Math.cos(angleRad) - translatedY * Math.sin(angleRad);
      const rotatedY =
        translatedX * Math.sin(angleRad) + translatedY * Math.cos(angleRad);

      // Translate back
      const transformedX = centerX + rotatedX;
      const transformedY = centerY + rotatedY;

      return Math.hypot(transformedX - handle.x, transformedY - handle.y) <= 8;
    }

    return Math.hypot(x - handle.x, y - handle.y) <= 8;
  }

  /**
   * Begin rotation of the selected shape
   */
  public beginRotation() {
    if (!this.selectedShape) return;

    this.isRotating = true;
    this.rotationCenter = {
      x: (this.selectedShape.x1 + this.selectedShape.x2) / 2,
      y: (this.selectedShape.y1 + this.selectedShape.y2) / 2,
    };
  }

  /**
   * Update rotation based on mouse movement
   */
  public updateRotation(x: number, y: number) {
    if (!this.isRotating || !this.selectedShape) return;

    // Calculate angle between center and current mouse position
    const angle = Math.atan2(
      y - this.rotationCenter.y,
      x - this.rotationCenter.x,
    );

    // Convert to degrees and normalize to 0-360
    let degrees = angle * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;

    // Update the shape rotation
    this.selectedShape.rotation = degrees;
  }

  /**
   * End rotation operation
   */
  public endRotation() {
    this.isRotating = false;

    // Add WebSocket code here to emit rotation updates
    // if (this.selectedShape) {
    //   socket.emit('updateShape', {
    //     roomId: this.roomId,
    //     shapeId: this.selectedShape.id,
    //     updates: { rotation: this.selectedShape.rotation }
    //   });
    // }
  }

  /**
   * Finds which shape (if any) is at the given point
   * Returns the most appropriate shape at that position, prioritizing smaller shapes
   * to handle nested shapes correctly
   */
  public getShapeAtPoint(x: number, y: number, shapes: Shape[]): Shape | null {
    // Find all shapes containing the point
    const containingShapes = shapes.filter(shape =>
      this.isPointInsideShape(shape, x, y),
    );

    if (containingShapes.length === 0) {
      this.selectedShape = null;
      return null;
    }

    // Calculate area for each shape
    const shapesWithArea = containingShapes.map(shape => {
      const width = Math.abs(shape.x2 - shape.x1);
      const height = Math.abs(shape.y2 - shape.y1);
      const area = width * height;
      return { shape, area };
    });

    // Sort by area (ascending) and then by z-index (descending)
    shapesWithArea.sort((a, b) => {
      // If areas are significantly different, prefer the smaller one
      if (Math.abs(a.area - b.area) > 100) {
        return a.area - b.area; // Smaller area first
      }

      // Otherwise, use z-index (based on array position)
      const aIndex = shapes.indexOf(a.shape);
      const bIndex = shapes.indexOf(b.shape);
      return bIndex - aIndex; // Higher index (top) first
    });

    // Select the best match (smallest area that contains the point)
    const selectedShape = shapesWithArea[0].shape;
    this.selectedShape = selectedShape;

    // Move the shape to the end of the array (top of the stack)
    const index = shapes.indexOf(selectedShape);
    shapes.splice(index, 1);
    shapes.push(selectedShape);

    return selectedShape;
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
   * Gets all currently selected shapes (in single-selection mode, returns array with 0 or 1 item)
   */
  public getSelectedShapes(): Shape[] {
    return this.selectedShape ? [this.selectedShape] : [];
  }

  /**
   * Starts marquee selection from a point
   */
  public beginMarqueeSelection(x: number, y: number) {
    this.isMarqueeSelecting = true;
    this.marqueeStartX = x;
    this.marqueeStartY = y;
    this.marqueeEndX = x;
    this.marqueeEndY = y;
  }

  /**
   * Updates marquee selection
   */
  public updateMarqueeSelection(x: number, y: number) {
    if (!this.isMarqueeSelecting) return;
    this.marqueeEndX = x;
    this.marqueeEndY = y;
  }

  /**
   * Completes marquee selection and selects all shapes inside the marquee
   * Modified to prioritize smaller shapes for better nested shape handling
   */
  public completeMarqueeSelection(shapes: Shape[]) {
    if (!this.isMarqueeSelecting) return;

    const minX = Math.min(this.marqueeStartX, this.marqueeEndX);
    const maxX = Math.max(this.marqueeStartX, this.marqueeEndX);
    const minY = Math.min(this.marqueeStartY, this.marqueeEndY);
    const maxY = Math.max(this.marqueeStartY, this.marqueeEndY);

    // Clear current selection
    this.selectedShape = null;

    // Find all shapes that intersect with marquee
    const intersectingShapes = shapes.filter(shape =>
      this.doesShapeIntersectRect(shape, minX, minY, maxX, maxY),
    );

    if (intersectingShapes.length === 0) {
      this.isMarqueeSelecting = false;
      return;
    }

    // Calculate area for each shape
    const shapesWithArea = intersectingShapes.map(shape => {
      const width = Math.abs(shape.x2 - shape.x1);
      const height = Math.abs(shape.y2 - shape.y1);
      const area = width * height;
      return { shape, area };
    });

    // Sort by area (ascending) and then by z-index (descending)
    shapesWithArea.sort((a, b) => {
      // If areas are significantly different, prefer the smaller one
      if (Math.abs(a.area - b.area) > 100) {
        return a.area - b.area; // Smaller area first
      }

      // Otherwise, use z-index (based on array position)
      const aIndex = shapes.indexOf(a.shape);
      const bIndex = shapes.indexOf(b.shape);
      return bIndex - aIndex; // Higher index (top) first
    });

    // Select the best match (smallest shape in the marquee)
    this.selectedShape = shapesWithArea[0].shape;

    this.isMarqueeSelecting = false;
  }

  /**
   * Draws the marquee selection rectangle
   */
  public drawMarqueeSelection() {
    if (!this.isMarqueeSelecting) return;

    const minX = Math.min(this.marqueeStartX, this.marqueeEndX);
    const maxX = Math.max(this.marqueeStartX, this.marqueeEndX);
    const minY = Math.min(this.marqueeStartY, this.marqueeEndY);
    const maxY = Math.max(this.marqueeStartY, this.marqueeEndY);

    this.context.save();
    this.context.strokeStyle = '#625ee0';
    this.context.lineWidth = 1;
    this.context.strokeRect(minX, minY, maxX - minX, maxY - minY);
    this.context.fillStyle = 'rgba(98, 94, 224, 0.1)';
    this.context.fillRect(minX, minY, maxX - minX, maxY - minY);
    this.context.restore();
  }

  /**
   * Checks if a shape intersects with a rectangle
   */
  private doesShapeIntersectRect(
    shape: Shape,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
  ): boolean {
    // For simple shapes like rectangles and ellipses
    const shapeMinX = Math.min(shape.x1, shape.x2);
    const shapeMaxX = Math.max(shape.x1, shape.x2);
    const shapeMinY = Math.min(shape.y1, shape.y2);
    const shapeMaxY = Math.max(shape.y1, shape.y2);

    // Check if the rectangles overlap
    return !(
      shapeMaxX < minX ||
      shapeMinX > maxX ||
      shapeMaxY < minY ||
      shapeMinY > maxY
    );
  }

  /**
   * Starts dragging a shape
   */
  public beginDrag() {
    this.isDragging = true;
  }

  /**
   * Updates shape position during dragging
   */
  public updateDrag(deltaX: number, deltaY: number) {
    if (this.selectedShape && this.isDragging) {
      // Move the selected shape
      this.selectedShape.x1 += deltaX;
      this.selectedShape.y1 += deltaY;
      this.selectedShape.x2 += deltaX;
      this.selectedShape.y2 += deltaY;
    }
  }

  /**
   * Ends dragging operation
   */
  public endDrag() {
    this.isDragging = false;

    // Add WebSocket code here to emit position updates for the moved shape
    // if (this.selectedShape) {
    //   socket.emit('updateShape', {
    //     roomId: this.roomId,
    //     shapeId: this.selectedShape.id,
    //     updates: {
    //       x1: this.selectedShape.x1,
    //       y1: this.selectedShape.y1,
    //       x2: this.selectedShape.x2,
    //       y2: this.selectedShape.y2
    //     }
    //   });
    // }
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

    // Add WebSocket code here to emit dimension updates for the resized shape
    // if (this.selectedShape) {
    //   socket.emit('updateShape', {
    //     roomId: this.roomId,
    //     shapeId: this.selectedShape.id,
    //     updates: {
    //       x1: this.selectedShape.x1,
    //       y1: this.selectedShape.y1,
    //       x2: this.selectedShape.x2,
    //       y2: this.selectedShape.y2
    //     }
    //   });
    // }
  }

  /**
   * Draw the rotation handle for the selected shape
   */
  public drawRotationHandle(shape: Shape) {
    const handle = this.getRotationHandle(shape);

    this.context.save();

    // Draw line from center to handle
    const centerX = (shape.x1 + shape.x2) / 2;
    const centerY = (shape.y1 + shape.y2) / 2;
    this.context.beginPath();
    this.context.strokeStyle = '#625ee0';
    this.context.lineWidth = 1;
    this.context.setLineDash([3, 3]);
    this.context.moveTo(centerX, centerY);
    this.context.lineTo(handle.x, handle.y);
    this.context.stroke();

    // Draw rotation handle
    this.context.beginPath();
    this.context.arc(handle.x, handle.y, 6, 0, Math.PI * 2);
    this.context.fillStyle = '#625ee0';
    this.context.fill();
    this.context.strokeStyle = '#625ee0';
    this.context.setLineDash([]);
    this.context.lineWidth = 1.5;
    this.context.stroke();

    this.context.restore();
  }

  /**
   * Enhanced version of drawing selection outline
   */
  public drawSelectionOutline(shape: Shape) {
    const { x1, y1, x2, y2 } = shape;
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    this.context.save();

    // Apply rotation if needed
    if (shape.rotation) {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      this.context.translate(centerX, centerY);
      this.context.rotate((shape.rotation * Math.PI) / 180);
      this.context.translate(-centerX, -centerY);
    }

    // Draw selection rectangle
    this.context.strokeStyle = '#625ee0';
    this.context.lineWidth = 1;
    this.context.setLineDash([]);

    if (shape.type === 'Line' || shape.type === 'Arrow') {
      // For lines and arrows, draw endpoint handles with improved visibility
      const handles = [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
      ];

      for (const pos of handles) {
        // Draw outer circle for better visibility
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
        this.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.context.fill();

        // Draw inner circle
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        this.context.fillStyle = '#625ee0';
        this.context.fill();
        this.context.strokeStyle = '#625ee0';
        this.context.lineWidth = 1.5;
        this.context.stroke();
      }
    } else {
      // For other shapes, draw rectangular selection box with improved padding
      const padding = 8;
      this.context.strokeRect(
        minX - padding,
        minY - padding,
        width + padding * 2,
        height + padding * 2,
      );

      // Draw filled corner handles with improved visibility
      const cornerHandles = [
        { x: minX - padding, y: minY - padding }, // top-left
        { x: minX + width / 2, y: minY - padding }, // top-center
        { x: minX + width + padding, y: minY - padding }, // top-right
        { x: minX + width + padding, y: minY + height / 2 }, // middle-right
        { x: minX + width + padding, y: minY + height + padding }, // bottom-right
        { x: minX + width / 2, y: minY + height + padding }, // bottom-center
        { x: minX - padding, y: minY + height + padding }, // bottom-left
        { x: minX - padding, y: minY + height / 2 }, // middle-left
      ];

      for (const pos of cornerHandles) {
        // White fill with blue border for better visibility
        this.context.beginPath();
        this.context.rect(pos.x - 4, pos.y - 4, 8, 8);
        this.context.fillStyle = '#625ee0';
        this.context.fill();
        this.context.strokeStyle = '#625ee0';
        this.context.stroke();
      }

      // Draw rotation handle
      this.drawRotationHandle(shape);
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

    // Check if we're near the rotation handle
    if (this.isNearRotationHandle(x, y)) {
      this.canvas.style.cursor = 'grab';
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
