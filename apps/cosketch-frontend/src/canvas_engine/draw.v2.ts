import { Tool } from '@/type/tool';
import cuid from 'cuid';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';
import { SelectionManager } from './selection_manager';
import { getExistingShapes } from '@/api/canvas';

/**
 * Represents a shape on the canvas with its properties and rough.js drawable
 */
export interface Shape {
  id: string;
  type: Tool;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  shape: Drawable | Drawable[];
  rotation?: number; // Add rotation property to Shape interface
  paths?: [number, number][];
}

/**
 * Main drawing engine that handles shape creation, manipulation, and rendering
 * Uses rough.js for hand-drawn style rendering
 */
export class DrawV2 {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private rc: RoughCanvas;
  private generator: RoughGenerator;

  // Current action state
  private action:
    | 'none'
    | 'moving'
    | 'drawing'
    | 'resizing'
    | 'rotating'
    | 'marquee-selecting' = 'none';
  private selectedTool: Tool = 'Selection';
  private existingShapes: Shape[] = [];

  // Keyboard state for modifiers
  private isShiftKeyPressed = false;
  private isCtrlKeyPressed = false;

  // Stroke style configurations
  private strokeStyles = {
    solid: [],
    dashed: [10, 5],
    dotted: [2, 6],
  };

  // Roughness levels for hand-drawn style
  private roughnessLevels = {
    none: 0,
    low: 0.5,
    normal: 1,
    high: 3,
  };

  // Stroke width options
  private strokeWidths = {
    thin: 2,
    medium: 3,
    thick: 5,
  };

  // Current drawing style settings
  private roughness: 'none' | 'normal' | 'high' = 'none';
  private strokeStyle: 'solid' | 'dashed' | 'dotted' = 'solid';
  private strokeWidth: 'thin' | 'medium' | 'thick' = 'thin';
  private fillStyle: 'hachure' | 'solid' | 'cross-hatch' = 'hachure';
  private fillColor: string = 'transparent';
  private strokeColor: string = 'white';
  private seed = 42;
  private roomId: string;
  private selectionManager: SelectionManager;

  // Drawing coordinates
  private x1: number = 0;
  private y1: number = 0;
  private x2: number = 0;
  private y2: number = 0;

  /**
   * Initializes the drawing engine with canvas and room context
   */
  constructor(canvas: HTMLCanvasElement, roomId: string) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.rc = rough.canvas(canvas);
    this.generator = rough.generator();
    this.roomId = roomId;
    this.selectionManager = new SelectionManager(this.canvas, this.context);

    this.init().then(() => this.initHandlers());
  }

  /**
   * Loads existing shapes from the server
   */
  private async init() {
    const shapes = await getExistingShapes(this.roomId);
    this.existingShapes = Array.isArray(shapes) ? shapes : [];
  }

  /**
   * Sets up mouse and keyboard event handlers for drawing and selection
   */
  private initHandlers() {
    this.canvas.addEventListener('mousedown', this.mouseDownHandler);
    this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.addEventListener('mouseup', this.mouseUpHandler);

    // Add keyboard event listeners for modifier keys
    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
  }

  /**
   * Cleans up event listeners when the drawing engine is destroyed
   */
  destroy() {
    this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
    this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.removeEventListener('mouseup', this.mouseUpHandler);

    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
  }

  /**
   * Handles key down events for modifier keys
   */
  private keyDownHandler = (event: KeyboardEvent) => {
    if (event.key === 'Control' || event.key === 'Meta') {
      this.isCtrlKeyPressed = true;
    }

    // Delete key for deleting selected shape
    if (event.key === 'Delete' || event.key === 'Backspace') {
      this.deleteSelectedShape();
    }
  };

  /**
   * Handles key up events for modifier keys
   */
  private keyUpHandler = (event: KeyboardEvent) => {
    if (event.key === 'Control' || event.key === 'Meta') {
      this.isCtrlKeyPressed = false;
    }
  };

  /**
   * Deletes selected shapes
   */
  private deleteSelectedShape() {
    const selectedShape = this.selectionManager.getSelectedShape();
    if (selectedShape) {
      // Remove the selected shape from existingShapes
      this.existingShapes = this.existingShapes.filter(
        shape => shape.id !== selectedShape.id,
      );

      // Clear selection
      this.selectionManager.setSelectedShape(null);
      this.clearCanvas();
    }
  }

  /**
   * Returns the current drawing options for rough.js
   */
  private getOptions() {
    return {
      roughness: this.roughnessLevels[this.roughness],
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidths[this.strokeWidth],
      fill: this.fillColor,
      fillStyle: this.fillStyle,
      strokeLineDash: this.strokeStyles[this.strokeStyle],
      seed: this.seed,
    };
  }

  /**
   * Handles mouse down events for drawing and selection
   */
  private mouseDownHandler = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.x1 = event.clientX - rect.left;
    this.y1 = event.clientY - rect.top;

    if (this.selectedTool === 'Selection') {
      // Check if clicking on rotation handle
      if (this.selectionManager.isNearRotationHandle(this.x1, this.y1)) {
        this.action = 'rotating';
        this.selectionManager.beginRotation(this.x1, this.y1);
        return;
      }

      // Check if clicking on resize handle
      const handle = this.selectionManager.getResizeHandleAtPoint(
        this.x1,
        this.y1,
      );

      if (handle) {
        this.action = 'resizing';
        this.selectionManager.beginResize(handle);
      } else {
        // Check if clicking on existing shape
        const shape = this.selectionManager.getShapeAtPoint(
          this.x1,
          this.y1,
          this.existingShapes,
        );

        if (shape) {
          // Set as selected shape
          this.selectionManager.setSelectedShape(shape);
          this.action = 'moving';
          this.selectionManager.beginDrag();
        } else {
          // If not clicking on any shape, start marquee selection or clear selection
          this.action = 'marquee-selecting';
          this.selectionManager.beginMarqueeSelection(this.x1, this.y1);
          // Or simply:
          // this.selectionManager.setSelectedShape(null);
        }
      }
    } else {
      // Begin drawing new shape
      this.action = 'drawing';
    }
  };

  /**
   * Handles mouse move events for drawing, moving, and resizing
   */
  private mouseMoveHandler = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    // Update cursor style based on what's under the cursor
    this.selectionManager.updateCursor(currentX, currentY);

    if (this.action === 'drawing') {
      this.x2 = currentX;
      this.y2 = currentY;
      this.clearCanvas();
      this.previewShape();
    } else if (this.action === 'moving') {
      const deltaX = currentX - this.x1;
      const deltaY = currentY - this.y1;
      this.selectionManager.updateDrag(deltaX, deltaY);
      this.x1 = currentX;
      this.y1 = currentY;
      this.clearCanvas();

      // Redraw selected shape
      const selectedShape = this.selectionManager.getSelectedShape();
      if (selectedShape) {
        this.redrawShapeAfterTransform(selectedShape);
      }
    } else if (this.action === 'resizing') {
      const deltaX = currentX - this.x1;
      const deltaY = currentY - this.y1;
      this.selectionManager.updateResize(deltaX, deltaY);
      this.x1 = currentX;
      this.y1 = currentY;
      this.clearCanvas();
      this.redrawShapeAfterTransform(this.selectionManager.getSelectedShape());
    } else if (this.action === 'rotating') {
      this.selectionManager.updateRotation(currentX, currentY);
      this.clearCanvas();
      this.redrawShapeAfterTransform(this.selectionManager.getSelectedShape());
    } else if (this.action === 'marquee-selecting') {
      this.selectionManager.updateMarqueeSelection(currentX, currentY);
      this.clearCanvas();
      this.selectionManager.drawMarqueeSelection();
    }
  };

  /**
   * Handles mouse up events to finalize drawing, moving, or resizing
   */
  private mouseUpHandler = (event: MouseEvent) => {
    if (this.action === 'drawing') {
      const rect = this.canvas.getBoundingClientRect();
      this.x2 = event.clientX - rect.left;
      this.y2 = event.clientY - rect.top;
      this.drawShape();
    } else if (this.action === 'moving') {
      this.selectionManager.endDrag();
    } else if (this.action === 'resizing') {
      this.selectionManager.endResize();
    } else if (this.action === 'rotating') {
      this.selectionManager.endRotation();
    } else if (this.action === 'marquee-selecting') {
      this.selectionManager.completeMarqueeSelection(this.existingShapes);
    }

    this.action = 'none';
    this.clearCanvas();
  };

  /**
   * Shows a preview of the shape while drawing
   */
  private previewShape() {
    let shape: Drawable | Drawable[] | null = null;

    switch (this.selectedTool) {
      case 'Rectangle':
        shape = this.drawRectangle();
        break;
      case 'Diamond':
        shape = this.drawDiamond();
        break;
      case 'Ellipse':
        shape = this.drawEllipse();
        break;
      case 'Arrow':
        shape = this.drawArrow();
        break;
      case 'Line':
        shape = this.drawLine();
        break;
      default:
        console.log('will add shape in future');
        break;
    }

    if (Array.isArray(shape)) {
      shape.forEach((drawable: Drawable) => {
        this.rc.draw(drawable);
      });
    } else if (shape) {
      this.rc.draw(shape);
    }
  }

  /**
   * Creates and adds a new shape to the canvas
   */
  private drawShape() {
    let shape: Drawable | Drawable[] | null = null;
    let type: Tool = 'Rectangle';

    switch (this.selectedTool) {
      case 'Rectangle':
        shape = this.drawRectangle();
        type = 'Rectangle';
        break;
      case 'Diamond':
        shape = this.drawDiamond();
        type = 'Diamond';
        break;
      case 'Ellipse':
        shape = this.drawEllipse();
        type = 'Ellipse';
        break;
      case 'Arrow':
        shape = this.drawArrow();
        type = 'Arrow';
        break;
      case 'Line':
        shape = this.drawLine();
        type = 'Line';
        break;
      default:
        console.log('will add shape in future');
        break;
    }

    if (shape) {
      const newShape = {
        id: cuid(),
        type: type,
        x1: this.x1,
        y1: this.y1,
        x2: this.x2,
        y2: this.y2,
        shape: shape,
        rotation: 0, // Default rotation
      };
      this.existingShapes.push(newShape);

      this.clearCanvas();
    }
  }

  /**
   * Redraws all shapes on the canvas
   */
  private drawAllShapes() {
    this.existingShapes.forEach(shape => {
      // Apply rotation if needed
      if (shape.rotation) {
        this.context.save();
        const centerX = (shape.x1 + shape.x2) / 2;
        const centerY = (shape.y1 + shape.y2) / 2;
        this.context.translate(centerX, centerY);
        this.context.rotate((shape.rotation * Math.PI) / 180);
        this.context.translate(-centerX, -centerY);
      }

      if (Array.isArray(shape.shape)) {
        shape.shape.forEach(drawable => this.rc.draw(drawable));
      } else {
        this.rc.draw(shape.shape);
      }

      if (shape.rotation) {
        this.context.restore();
      }
    });
  }

  /**
   * Clears the canvas and redraws all shapes and selection outlines
   */
  public clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.save();

    this.drawAllShapes();

    // Draw selection outline for selected shape
    const selectedShape = this.selectionManager.getSelectedShape();
    if (selectedShape) {
      this.selectionManager.drawSelectionOutline(selectedShape);
    }

    // Draw marquee selection if active
    this.selectionManager.drawMarqueeSelection();

    this.context.restore();
  }

  /**
   * Creates a rectangle shape
   */
  private drawRectangle(): Drawable {
    return this.generator.rectangle(
      Math.min(this.x1, this.x2),
      Math.min(this.y1, this.y2),
      Math.abs(this.x2 - this.x1),
      Math.abs(this.y2 - this.y1),
      this.getOptions(),
    );
  }

  /**
   * Creates a diamond shape
   */
  private drawDiamond(): Drawable {
    const centerX = (this.x1 + this.x2) / 2;
    const centerY = (this.y1 + this.y2) / 2;
    const width = Math.abs(this.x2 - this.x1);
    const height = Math.abs(this.y2 - this.y1);

    const points: [number, number][] = [
      [centerX, centerY - height / 2],
      [centerX + width / 2, centerY],
      [centerX, centerY + height / 2],
      [centerX - width / 2, centerY],
    ];

    return this.generator.polygon(points, this.getOptions());
  }

  /**
   * Creates an ellipse shape
   */
  private drawEllipse(): Drawable {
    const centerX = (this.x1 + this.x2) / 2;
    const centerY = (this.y1 + this.y2) / 2;
    const width = Math.abs(this.x2 - this.x1);
    const height = Math.abs(this.y2 - this.y1);

    return this.generator.ellipse(
      centerX,
      centerY,
      width,
      height,
      this.getOptions(),
    );
  }

  /**
   * Creates an arrow shape (line with arrowhead)
   */
  private drawArrow(): Drawable[] {
    const angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
    const arrowSize = 10;
    const arrowLeftX = this.x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowLeftY = this.y2 - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowRightX = this.x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowRightY = this.y2 - arrowSize * Math.sin(angle + Math.PI / 6);

    const line = this.generator.line(
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      this.getOptions(),
    );
    const arrowLeft = this.generator.line(
      this.x2,
      this.y2,
      arrowLeftX,
      arrowLeftY,
      this.getOptions(),
    );
    const arrowRight = this.generator.line(
      this.x2,
      this.y2,
      arrowRightX,
      arrowRightY,
      this.getOptions(),
    );

    return [line, arrowLeft, arrowRight];
  }

  /**
   * Creates a line shape
   */
  private drawLine(): Drawable {
    return this.generator.line(
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      this.getOptions(),
    );
  }

  /**
   * Redraws a shape after it has been transformed (moved, resized, or rotated)
   */
  private redrawShapeAfterTransform(shape: Shape | null) {
    if (!shape) return;

    const options = {
      ...this.getOptions(),
      stroke: this.strokeColor,
    };

    let newDrawable: Drawable | Drawable[] | null = null;

    switch (shape.type) {
      case 'Rectangle':
        newDrawable = this.generator.rectangle(
          Math.min(shape.x1, shape.x2),
          Math.min(shape.y1, shape.y2),
          Math.abs(shape.x2 - shape.x1),
          Math.abs(shape.y2 - shape.y1),
          options,
        );
        break;
      case 'Diamond': {
        const centerX = (shape.x1 + shape.x2) / 2;
        const centerY = (shape.y1 + shape.y2) / 2;
        const width = Math.abs(shape.x2 - shape.x1);
        const height = Math.abs(shape.y2 - shape.y1);
        const points: [number, number][] = [
          [centerX, centerY - height / 2],
          [centerX + width / 2, centerY],
          [centerX, centerY + height / 2],
          [centerX - width / 2, centerY],
        ];
        newDrawable = this.generator.polygon(points, options);
        break;
      }
      case 'Ellipse': {
        const centerX = (shape.x1 + shape.x2) / 2;
        const centerY = (shape.y1 + shape.y2) / 2;
        newDrawable = this.generator.ellipse(
          centerX,
          centerY,
          Math.abs(shape.x2 - shape.x1),
          Math.abs(shape.y2 - shape.y1),
          options,
        );
        break;
      }
      case 'Line':
        newDrawable = this.generator.line(
          shape.x1,
          shape.y1,
          shape.x2,
          shape.y2,
          options,
        );
        break;
      case 'Arrow': {
        const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
        const arrowSize = 10;
        const arrowLeftX = shape.x2 - arrowSize * Math.cos(angle - Math.PI / 6);
        const arrowLeftY = shape.y2 - arrowSize * Math.sin(angle - Math.PI / 6);
        const arrowRightX =
          shape.x2 - arrowSize * Math.cos(angle + Math.PI / 6);
        const arrowRightY =
          shape.y2 - arrowSize * Math.sin(angle + Math.PI / 6);
        newDrawable = [
          this.generator.line(shape.x1, shape.y1, shape.x2, shape.y2, options),
          this.generator.line(
            shape.x2,
            shape.y2,
            arrowLeftX,
            arrowLeftY,
            options,
          ),
          this.generator.line(
            shape.x2,
            shape.y2,
            arrowRightX,
            arrowRightY,
            options,
          ),
        ];
        break;
      }
    }

    if (newDrawable) {
      shape.shape = newDrawable;
    }
  }

  /**
   * Sets the current drawing tool
   */
  setSelectedTool(tool: Tool) {
    this.selectedTool = tool;

    // When switching to Selection tool, maintain current selection
    // When switching to other tools, clear selection
    if (tool !== 'Selection') {
      this.selectionManager.setSelectedShape(null);
      this.clearCanvas();
    }
  }

  /**
   * Duplicates the currently selected shape
   */
  duplicateSelectedShape() {
    const selectedShape = this.selectionManager.getSelectedShape();
    if (!selectedShape) return;

    const offset = 20; // Offset for duplicate shape

    const newShape = {
      ...selectedShape,
      id: cuid(),
      x1: selectedShape.x1 + offset,
      y1: selectedShape.y1 + offset,
      x2: selectedShape.x2 + offset,
      y2: selectedShape.y2 + offset,
    };

    // Recreate the drawable for the new shape
    this.redrawShapeAfterTransform(newShape);

    this.existingShapes.push(newShape);

    // Select the new shape
    this.selectionManager.setSelectedShape(newShape);

    this.clearCanvas();
  }

  /**
   * Brings the selected shape to the front (top of z-index)
   */
  bringToFront() {
    const selectedShape = this.selectionManager.getSelectedShape();
    if (!selectedShape) return;

    const index = this.existingShapes.findIndex(s => s.id === selectedShape.id);
    if (index !== -1) {
      this.existingShapes.splice(index, 1);
      this.existingShapes.push(selectedShape);
      this.clearCanvas();
    }
  }

  /**
   * Sends the selected shape to the back (bottom of z-index)
   */
  sendToBack() {
    const selectedShape = this.selectionManager.getSelectedShape();
    if (!selectedShape) return;

    const index = this.existingShapes.findIndex(s => s.id === selectedShape.id);
    if (index !== -1) {
      this.existingShapes.splice(index, 1);
      this.existingShapes.unshift(selectedShape);
      this.clearCanvas();
    }
  }

  /**
   * Sets the stroke style (solid, dashed, dotted)
   */
  setStrokeStyle(style: 'solid' | 'dashed' | 'dotted') {
    this.strokeStyle = style;
    this.updateSelectedShapeStyle();
  }

  /**
   * Sets the stroke width (thin, medium, thick)
   */
  setStrokeWidth(width: 'thin' | 'medium' | 'thick') {
    this.strokeWidth = width;
    this.updateSelectedShapeStyle();
  }

  /**
   * Sets the roughness level (none, normal, high)
   */
  setRoughness(level: 'none' | 'normal' | 'high') {
    this.roughness = level;
    this.updateSelectedShapeStyle();
  }

  /**
   * Sets the fill style (hachure, solid, cross-hatch)
   */
  setFillStyle(style: 'hachure' | 'solid' | 'cross-hatch') {
    this.fillStyle = style;
    this.updateSelectedShapeStyle();
  }

  /**
   * Sets the stroke color
   */
  setStrokeColor(color: string) {
    this.strokeColor = color;
    this.updateSelectedShapeStyle();
  }

  /**
   * Sets the fill color
   */
  setFillColor(color: string) {
    this.fillColor = color;
    this.updateSelectedShapeStyle();
  }

  /**
   * Gets all shapes on the canvas
   */
  getAllShapes() {
    return this.existingShapes;
  }

  /**
   * Gets the currently selected shape
   */
  public getSelectedShape(): Shape | null {
    return this.selectionManager.getSelectedShape();
  }

  /**
   * Updates the style of the currently selected shape
   */
  private updateSelectedShapeStyle() {
    const selectedShape = this.selectionManager.getSelectedShape();
    if (selectedShape) {
      this.redrawShapeAfterTransform(selectedShape);
      this.clearCanvas();
    }
  }

  /**
   * Selects all shapes on the canvas (now just selects the top-most shape)
   */
  selectAll() {
    if (this.existingShapes.length > 0) {
      // Just select the top-most shape (last in the array)
      const topShape = this.existingShapes[this.existingShapes.length - 1];
      this.selectionManager.setSelectedShape(topShape);
      this.clearCanvas();
    }
  }
}
