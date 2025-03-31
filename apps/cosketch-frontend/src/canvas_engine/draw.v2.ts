import { Tool } from '@/type/tool';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { RoughGenerator } from 'roughjs/bin/generator';

export class DrawV2 {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private rc: RoughCanvas;
  private generator: RoughGenerator;

  private action: 'none' | 'moving' | 'drawing' = 'none';
  private selectedTool: Tool = 'Selection';
  private existingShapes: any[] = [];

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

  private roughness: 'none' | 'normal' | 'high' = 'none';
  private seed = 42;

  private strokeStyle: 'solid' | 'dashed' | 'dotted' = 'solid';
  private strokeColor: string = 'white';
  private strokeWidth: 'thin' | 'medium' | 'thick' = 'thin';

  private strokeWidths = {
    thin: 1,
    medium: 3,
    thick: 5,
  };

  private fillStyle: 'hachure' | 'solid' | 'cross-hatch' = 'hachure';
  private fillColor: string = 'white';

  private startX: number = 0;
  private startY: number = 0;
  private endX: number = 0;
  private endY: number = 0;

  constructor(canvas: HTMLCanvasElement, roomId: string) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.rc = rough.canvas(canvas);
    this.generator = rough.generator();

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
    if (this.selectedTool === 'Rectangle') {
      const rect = this.generator.rectangle(
        this.startX,
        this.startY,
        this.endX - this.startX,
        this.endY - this.startY,
        this.getOptions(),
      );
      this.rc.draw(rect);
    }
  }

  private drawShape() {
    if (this.selectedTool === 'Rectangle') {
      const rect = this.generator.rectangle(
        this.startX,
        this.startY,
        this.endX - this.startX,
        this.endY - this.startY,
        this.getOptions(),
      );
      this.rc.draw(rect);
      this.existingShapes.push(rect);
    }
  }

  private drawAllShapes() {
    this.existingShapes.forEach(shape => {
      this.rc.draw(shape);
    });
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.save();
    this.drawAllShapes();
    this.context.restore();
  }
}
