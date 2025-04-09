// import { getExistingShapes } from '@/api/canvas';
// import { Tool } from '@/type/tool';
// import rough from 'roughjs';
// import { RoughCanvas } from 'roughjs/bin/canvas';
// import type { Shape } from '@repo/types';

// export class Draw {
//   private roomId: string;
//   private canvas: HTMLCanvasElement;
//   private ctx: CanvasRenderingContext2D;

//   private selectedTool: Tool = 'Selection';
//   private existingShapes: Shape[] = [];

//   private startX = 0;
//   private startY = 0;

//   private action: 'none' | 'moving' | 'drawing' = 'none';

//   private rc: RoughCanvas;
//   private roughness: number = 0.5;
//   private stroke: string = 'white';

//   constructor(canvas: HTMLCanvasElement, roomId: string) {
//     this.canvas = canvas;
//     this.ctx = canvas.getContext('2d')!;
//     this.roomId = roomId;
//     this.rc = rough.canvas(canvas);

//     this.init().then(() => {
//       this.initHandlers();
//     });
//   }

//   // Initialization
//   private async init() {
//     const shapes = await getExistingShapes(this.roomId);
//     this.existingShapes = Array.isArray(shapes) ? shapes : [];
//   }

//   private initHandlers() {
//     this.canvas.addEventListener('mousedown', this.mouseDownHandler.bind(this));
//     this.canvas.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
//     this.canvas.addEventListener('mouseup', this.mouseUpHandler.bind(this));
//   }

//   destroy() {
//     this.canvas.removeEventListener(
//       'mousedown',
//       this.mouseDownHandler.bind(this),
//     );
//     this.canvas.removeEventListener(
//       'mousemove',
//       this.mouseMoveHandler.bind(this),
//     );
//     this.canvas.removeEventListener('mouseup', this.mouseUpHandler.bind(this));
//   }

//   private drawAllShapes() {
//     this.existingShapes.forEach(shape => {
//       switch (shape.type) {
//         case 'Rectangle':
//           this.drawRectangle(shape);
//           break;
//         case 'Diamond':
//           this.drawDiamond(shape);
//           break;
//         case 'Ellipse':
//           this.drawEllipse(shape);
//           break;
//         case 'Line':
//           this.drawLine(shape);
//           break;
//         case 'Arrow':
//           this.drawArrow(shape);
//           break;
//         case 'FreeDraw':
//           // this.drawFreeDraw(shape);
//           break;
//         case 'Text':
//           // this.drawText(shape);
//           break;
//       }
//     });
//   }

//   private clearCanvas() {
//     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     this.ctx.save();
//     this.drawAllShapes();
//     this.ctx.restore();
//   }

//   setSelectedTool(tool: Tool) {
//     this.selectedTool = tool;
//   }

//   getElementAtPosition() {
//     return;
//   }

//   // Mouse Event Handlers
//   private mouseDownHandler(event: MouseEvent) {
//     const rect = this.canvas.getBoundingClientRect();
//     this.startX = event.clientX - rect.left;
//     this.startY = event.clientY - rect.top;

//     if (this.selectedTool === 'Selection') {
//       this.action = 'moving';
//     } else {
//       this.action = 'drawing';
//     }
//   }

//   private mouseMoveHandler(event: MouseEvent) {
//     if (this.action === 'drawing') {
//       const rect = this.canvas.getBoundingClientRect();
//       const currentX = event.clientX - rect.left;
//       const currentY = event.clientY - rect.top;

//       let newShape: Shape | null = null;

//       switch (this.selectedTool) {
//         case 'Rectangle':
//           newShape = {
//             type: 'Rectangle',
//             startX: this.startX,
//             startY: this.startY,
//             width: currentX - this.startX,
//             height: currentY - this.startY,
//             stroke: this.stroke,
//             roughness: this.roughness,
//           };
//           break;
//         case 'Diamond':
//           const width = Math.abs(currentX - this.startX);
//           const height = Math.abs(currentY - this.startY);
//           newShape = {
//             type: 'Diamond',
//             startX: Math.min(this.startX, currentX),
//             startY: Math.min(this.startY, currentY),
//             width,
//             height,
//             roughness: this.roughness,
//             stroke: this.stroke,
//           };
//           break;
//         case 'Ellipse':
//           const x1 = Math.min(this.startX, currentX);
//           const y1 = Math.min(this.startY, currentY);
//           const x2 = Math.max(this.startX, currentX);
//           const y2 = Math.max(this.startY, currentY);

//           newShape = {
//             type: 'Ellipse',
//             startX: x1,
//             startY: y1,
//             width: x2 - x1,
//             height: y2 - y1,
//             stroke: this.stroke,
//             roughness: this.roughness,
//           };
//           break;
//         case 'Arrow':
//           newShape = {
//             type: 'Arrow',
//             startX: this.startX,
//             startY: this.startY,
//             endX: currentX,
//             endY: currentY,
//             stroke: this.stroke,
//             roughness: this.roughness,
//           };
//           break;
//         case 'Line':
//           newShape = {
//             type: 'Line',
//             startX: this.startX,
//             startY: this.startY,
//             endX: currentX,
//             endY: currentY,
//             stroke: this.stroke,
//             roughness: this.roughness,
//           };
//           break;
//         case 'FreeDraw':
//           break;
//         case 'Text':
//           break;
//       }

//       if (newShape) {
//         this.clearCanvas();
//         this.drawAllShapes();
//         if (this.selectedTool === 'Rectangle') this.drawRectangle(newShape);
//         if (this.selectedTool === 'Diamond') this.drawDiamond(newShape);
//         if (this.selectedTool === 'Ellipse') this.drawEllipse(newShape);
//         if (this.selectedTool === 'Arrow') this.drawArrow(newShape);
//         if (this.selectedTool === 'Line') this.drawLine(newShape);
//       }
//     }
//   }

//   private mouseUpHandler(event: MouseEvent) {
//     this.action = 'none';
//     const rect = this.canvas.getBoundingClientRect();
//     const endX = event.clientX - rect.left;
//     const endY = event.clientY - rect.top;

//     let newShape: Shape | null = null;

//     switch (this.selectedTool) {
//       case 'Rectangle':
//         newShape = {
//           type: 'Rectangle',
//           startX: this.startX,
//           startY: this.startY,
//           width: endX - this.startX,
//           height: endY - this.startY,
//           stroke: this.stroke,
//           roughness: this.roughness,
//         };
//         break;
//       case 'Diamond':
//         const finalWidth = Math.abs(endX - this.startX);
//         const finalHeight = Math.abs(endY - this.startY);
//         newShape = {
//           type: 'Diamond',
//           startX: Math.min(this.startX, endX),
//           startY: Math.min(this.startY, endY),
//           width: finalWidth,
//           height: finalHeight,
//           roughness: this.roughness,
//           stroke: this.stroke,
//         };
//         break;
//       case 'Ellipse':
//         const x1 = Math.min(this.startX, endX);
//         const y1 = Math.min(this.startY, endY);
//         const x2 = Math.max(this.startX, endX);
//         const y2 = Math.max(this.startY, endY);

//         newShape = {
//           type: 'Ellipse',
//           startX: x1,
//           startY: y1,
//           width: x2 - x1,
//           height: y2 - y1,
//           stroke: this.stroke,
//           roughness: this.roughness,
//         };
//         break;
//       case 'Arrow':
//         newShape = {
//           type: 'Arrow',
//           startX: this.startX,
//           startY: this.startY,
//           endX: endX, // Final position
//           endY: endY,
//           stroke: this.stroke,
//           roughness: this.roughness,
//         };
//         break;
//       case 'Line':
//         newShape = {
//           type: 'Line',
//           startX: this.startX,
//           startY: this.startY,
//           endX: endX, // Final position
//           endY: endY,
//           stroke: this.stroke,
//           roughness: this.roughness,
//         };
//         break;
//       case 'FreeDraw':
//         break;
//       case 'Text':
//         break;
//     }

//     if (newShape) {
//       this.existingShapes.push(newShape);
//       this.clearCanvas();
//       this.drawAllShapes();
//     }
//   }

//   // Drawing Methods
//   private drawRectangle(shape: Shape) {
//     if (shape.type !== 'Rectangle' || !shape.width || !shape.height) return;

//     this.rc.rectangle(shape.startX, shape.startY, shape.width, shape.height, {
//       stroke: shape.stroke,
//       roughness: shape.roughness, // Reduces randomness
//       seed: 42,
//     });
//   }

//   private drawDiamond(shape: Shape) {
//     if (shape.type !== 'Diamond' || !shape.width || !shape.height) return;

//     const centerX = shape.startX + shape.width / 2;
//     const centerY = shape.startY + shape.height / 2;

//     const points: [number, number][] = [
//       [centerX, centerY - shape.height / 2], // Top
//       [centerX + shape.width / 2, centerY], // Right
//       [centerX, centerY + shape.height / 2], // Bottom
//       [centerX - shape.width / 2, centerY], // Left
//     ];

//     this.rc.polygon(points, {
//       stroke: shape.stroke,
//       roughness: shape.roughness,
//       seed: 42,
//     });
//   }

//   private drawEllipse(shape: Shape) {
//     if (shape.type !== 'Ellipse' || !shape.width || !shape.height) return;

//     const centerX = shape.startX + shape.width / 2;
//     const centerY = shape.startY + shape.height / 2;

//     this.rc.ellipse(centerX, centerY, shape.width, shape.height, {
//       stroke: shape.stroke,
//       roughness: shape.roughness,
//       seed: 42,
//     });
//   }

//   private drawArrow(shape: Shape) {
//     if (shape.type !== 'Arrow' || !shape.endX || !shape.endY) return;

//     // Draw the line
//     this.rc.line(shape.startX, shape.startY, shape.endX, shape.endY, {
//       stroke: shape.stroke,
//       roughness: shape.roughness,
//       seed: 42,
//     });

//     // Calculate arrowhead direction
//     const arrowSize = 10; // Length of arrowhead
//     const angle = Math.atan2(
//       shape.endY - shape.startY,
//       shape.endX - shape.startX,
//     ); // Angle of line

//     // Arrowhead points
//     const arrowLeftX = shape.endX - arrowSize * Math.cos(angle - Math.PI / 6);
//     const arrowLeftY = shape.endY - arrowSize * Math.sin(angle - Math.PI / 6);
//     const arrowRightX = shape.endX - arrowSize * Math.cos(angle + Math.PI / 6);
//     const arrowRightY = shape.endY - arrowSize * Math.sin(angle + Math.PI / 6);

//     // Draw arrowhead
//     this.rc.line(shape.endX, shape.endY, arrowLeftX, arrowLeftY, {
//       stroke: shape.stroke,
//       roughness: shape.roughness,
//       seed: 42,
//     });
//     this.rc.line(shape.endX, shape.endY, arrowRightX, arrowRightY, {
//       stroke: shape.stroke,
//       roughness: shape.roughness,
//       seed: 42,
//     });
//   }

//   private drawLine(shape: Shape) {
//     if (shape.type !== 'Line' || !shape.endX || !shape.endY) return;

//     this.rc.line(shape.startX, shape.startY, shape.endX, shape.endY, {
//       stroke: shape.stroke,
//       roughness: shape.roughness,
//       seed: 42,
//     });
//   }
// }
