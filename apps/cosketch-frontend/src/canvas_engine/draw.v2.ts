import { Tool } from '@/type/tool';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { RoughGenerator } from 'roughjs/bin/generator';

interface Shape {}

export class DrawV2 {
  // canvas
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;

  // toolbar tool
  private selectedTool: Tool = 'Selection';

  // roughjs
  private rc: RoughCanvas;
  private generator: RoughGenerator;

  // style shapes

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
  private roughness: 'normal' | 'high' | 'none' = 'none';

  private strokeStyle: 'solid' | 'dashed' | 'dotted' = 'solid';
  private strokeColor: string = 'white';
  private strokeWidth: 'thin' | 'medium' | 'thick' = 'medium';

  private strokeWidths = {
    thin: 1,
    medium: 3,
    thick: 5,
  };

  private fillStyle: 'hachure' | 'solid' | 'cross-hatch' = 'hachure';

  private fillColor: string = 'white';

  private options = {
    roughness: this.roughnessLevels[this.roughness],
    stroke: this.strokeColor,
    strokeWidth: this.strokeWidths[this.strokeWidth],
    fill: this.fillColor,
    fillStyle: this.fillStyle,
    strokeLineDash: this.strokeStyles[this.strokeStyle], // For dashed/dotted lines
  };

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

  constructor(canvas: HTMLCanvasElement, roomId: string) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.rc = rough.canvas(canvas);
    this.generator = rough.generator();
  }

  private initHandlers() {
    // this.canvas.addEventListener('mousedown', this.mouseDownHandler.bind(this));
    // this.canvas.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
    // this.canvas.addEventListener('mouseup', this.mouseUpHandler.bind(this));
  }

  destroy() {
    // this.canvas.removeEventListener(
    //   'mousedown',
    //   this.mouseDownHandler.bind(this),
    // );
    // this.canvas.removeEventListener(
    //   'mousemove',
    //   this.mouseMoveHandler.bind(this),
    // );
    // this.canvas.removeEventListener('mouseup', this.mouseUpHandler.bind(this));
  }

  setSelectedTool(tool: Tool) {
    this.selectedTool = tool;
  }

  drawShapes(shape: any) {
    this.rc.draw(shape);
  }
}
