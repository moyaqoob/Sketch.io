import { DrawController } from '@/canvas_engine/draw_controller';
import { create } from 'zustand';

interface CanvasEngineState {
  canvasEngine: DrawController | null;
  setCanvasEngine: (engine: DrawController) => void;
}

export const useCanvasEngineStore = create<CanvasEngineState>(set => ({
  canvasEngine: null,
  setCanvasEngine: (engine: DrawController) => set({ canvasEngine: engine }),
}));
