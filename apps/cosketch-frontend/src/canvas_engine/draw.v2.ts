import { Tool } from '@/type/tool';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { RoughGenerator } from 'roughjs/bin/generator';

interface Shape {
  type: Tool;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  shape: Drawable | Drawable[];
}

export class DrawV2 {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private rc: RoughCanvas;
  private generator: RoughGenerator;

  private action: 'none' | 'moving' | 'drawing' = 'none';
  private selectedTool: Tool = 'Selection';
  private existingShapes: Shape[] = [];

  private strokeStyles = {
    solid: [],
    dashed: [10, 5],
    dotted: [2, 6],
  };
  private roughnessLevels = {
    none: 0,
    low: 0.5,
    normal: 1,
    high: 3,
  };
  private strokeWidths = {
    thin: 2,
    medium: 3,
    thick: 5,
  };

  private roughness: 'none' | 'normal' | 'high' = 'none';
  private strokeStyle: 'solid' | 'dashed' | 'dotted' = 'solid';
  private strokeWidth: 'thin' | 'medium' | 'thick' = 'thin';
  private fillStyle: 'hachure' | 'solid' | 'cross-hatch' = 'hachure';
  private fillColor: string = 'transparent';
  private strokeColor: string = 'white';
  private seed = 42;
  private roomId: string;

  private startX: number = 0;
  private startY: number = 0;

  private endX: number = 0;
  private endY: number = 0;

  constructor(canvas: HTMLCanvasElement, roomId: string) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.rc = rough.canvas(canvas);
    this.generator = rough.generator();
    this.roomId = roomId;
    this.initHandlers();
  }

  private initHandlers() {
    this.canvas.addEventListener('mousedown', this.mouseDownHandler);
    this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.addEventListener('mouseup', this.mouseUpHandler);
  }

  destroy() {
    this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
    this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.removeEventListener('mouseup', this.mouseUpHandler);
  }

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

  setSelectedTool(tool: Tool) {
    this.selectedTool = tool;
  }

  setStrokeStyle(style: 'solid' | 'dashed' | 'dotted') {
    this.strokeStyle = style;
  }

  setStrokeWidth(width: 'thin' | 'medium' | 'thick') {
    this.strokeWidth = width;
  }

  setRoughness(level: 'none' | 'normal' | 'high') {
    this.roughness = level;
  }

  setFillStyle(style: 'hachure' | 'solid' | 'cross-hatch') {
    this.fillStyle = style;
  }

  setStrokeColor(color: string) {
    this.strokeColor = color;
  }

  setFillColor(color: string) {
    this.fillColor = color;
  }

  private mouseDownHandler = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;

    if (this.selectedTool === 'Selection') {
      this.action = 'moving';
    } else {
      this.action = 'drawing';
    }
  };

  private mouseMoveHandler = (event: MouseEvent) => {
    if (this.action === 'drawing') {
      const rect = this.canvas.getBoundingClientRect();
      this.endX = event.clientX - rect.left;
      this.endY = event.clientY - rect.top;

      this.clearCanvas();
      this.previewShape();
    }
  };

  private mouseUpHandler = (event: MouseEvent) => {
    if (this.action === 'drawing') {
      const rect = this.canvas.getBoundingClientRect();
      this.endX = event.clientX - rect.left;
      this.endY = event.clientY - rect.top;

      this.drawShape();
      this.action = 'none';
    }
  };

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

    // If shape is an array of Drawables (like for Arrow)
    if (Array.isArray(shape)) {
      shape.forEach((drawable: Drawable) => {
        this.rc.draw(drawable);
      });
    } else if (shape) {
      // If shape is a single Drawable
      this.rc.draw(shape);
    }
  }

  private drawShape() {
    let shape: Drawable | Drawable[] | null = null;
    let type: Tool = 'Rectangle';

    switch (this.selectedTool) {
      case 'Rectangle':
        shape = this.drawRectangle();
        type = 'Rectangle';
        this.rc.draw(shape);
        break;
      case 'Diamond':
        shape = this.drawDiamond();
        type = 'Diamond';
        break;
      case 'Ellipse':
        type = 'Ellipse';
        shape = this.drawEllipse();
        break;
      case 'Arrow':
        type = 'Arrow';
        shape = this.drawArrow();
        break;
      case 'Line':
        type = 'Line';
        shape = this.drawLine();
        break;
      default:
        console.log('will add shape in future');
        break;
    }

    if (shape) {
      this.existingShapes.push({
        type: type,
        x1: this.startX,
        y1: this.startY,
        x2: this.endX,
        y2: this.endY,
        shape: shape,
      });
    }
  }

  private drawAllShapes() {
    this.existingShapes.forEach(shape => {
      if (shape.type === 'Arrow' && Array.isArray(shape.shape)) {
        shape.shape.forEach((drawable: Drawable) => {
          this.rc.draw(drawable);
        });
      } else {
        this.rc.draw(shape.shape as Drawable);
      }
    });
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.save();
    this.drawAllShapes();
    this.context.restore();
  }

  private drawRectangle(): Drawable {
    return this.generator.rectangle(
      Math.min(this.startX, this.endX),
      Math.min(this.startY, this.endY),
      Math.abs(this.endX - this.startX),
      Math.abs(this.endY - this.startY),
      this.getOptions(),
    );
  }

  private drawDiamond(): Drawable {
    const centerX = (this.startX + this.endX) / 2;
    const centerY = (this.startY + this.endY) / 2;
    const width = Math.abs(this.endX - this.startX);
    const height = Math.abs(this.endY - this.startY);

    // Diamond points (centered around centerX, centerY)
    const points: [number, number][] = [
      [centerX, centerY - height / 2], // Top
      [centerX + width / 2, centerY], // Right
      [centerX, centerY + height / 2], // Bottom
      [centerX - width / 2, centerY], // Left
    ];

    return this.rc.polygon(points, this.getOptions());
  }

  private drawEllipse(): Drawable {
    // Calculate the bounding box for the ellipse
    const x1 = Math.min(this.startX, this.endX);
    const y1 = Math.min(this.startY, this.endY);
    const x2 = Math.max(this.startX, this.endX);
    const y2 = Math.max(this.startY, this.endY);

    // Calculate the center of the ellipse
    const centerX = x1 + (x2 - x1) / 2; // Midpoint of x1 and x2
    const centerY = y1 + (y2 - y1) / 2; // Midpoint of y1 and y2

    // Calculate the width and height of the ellipse
    const width = x2 - x1;
    const height = y2 - y1;

    // Use the generator function to create the ellipse
    return this.generator.ellipse(
      centerX,
      centerY,
      width,
      height,
      this.getOptions(),
    );
  }

  private drawArrow(): Drawable[] {
    // Calculate the direction of the line
    const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX); // Angle of line

    // Arrow size (length of the arrowhead)
    const arrowSize = 10;

    // Arrowhead points
    const arrowLeftX = this.endX - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowLeftY = this.endY - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowRightX = this.endX - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowRightY = this.endY - arrowSize * Math.sin(angle + Math.PI / 6);

    // Draw the main line, arrow left, and arrow right
    const line = this.generator.line(
      this.startX,
      this.startY,
      this.endX,
      this.endY,
      this.getOptions(),
    );
    const arrowLeft = this.generator.line(
      this.endX,
      this.endY,
      arrowLeftX,
      arrowLeftY,
      this.getOptions(),
    );
    const arrowRight = this.generator.line(
      this.endX,
      this.endY,
      arrowRightX,
      arrowRightY,
      this.getOptions(),
    );

    // Return all the elements as an array to be stored
    return [line, arrowLeft, arrowRight];
  }

  private drawLine(): Drawable {
    return this.generator.line(
      this.startX,
      this.startY,
      this.endX,
      this.endY,
      this.getOptions(),
    );
  }
}
