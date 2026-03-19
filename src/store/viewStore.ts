import { create } from 'zustand'
import Konva from 'konva'

interface ViewState {
  scale: number
  offsetX: number
  offsetY: number
  gridSizeMm: number
  showGrid: boolean
  snapToGrid: boolean
  is3DVisible: boolean
  viewMode: '2d-only' | 'split' | '3d-only'
  stageRef: Konva.Stage | null
  currentStoreyId: string
  storeyHeight: number   // mm, default 2400

  setScale: (scale: number) => void
  setOffset: (x: number, y: number) => void
  setGridSize: (mm: number) => void
  toggleGrid: () => void
  toggleSnap: () => void
  toggle3DView: () => void
  resetView: () => void
  setStageRef: (stage: Konva.Stage | null) => void
  setCurrentStorey: (id: string) => void
  setStoreyHeight: (mm: number) => void
}

export const useViewStore = create<ViewState>((set) => ({
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  gridSizeMm: 100,       // 100mm = 10cm grid
  showGrid: true,
  snapToGrid: true,
  is3DVisible: false,
  viewMode: '2d-only',
  stageRef: null,
  currentStoreyId: 'storey-1',
  storeyHeight: 2400,

  setScale: (scale) => set({ scale: Math.min(Math.max(scale, 0.05), 20) }),
  setOffset: (offsetX, offsetY) => set({ offsetX, offsetY }),
  setGridSize: (gridSizeMm) => set({ gridSizeMm }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  toggle3DView: () =>
    set((s) => {
      const modes: ViewState['viewMode'][] = ['2d-only', 'split', '3d-only']
      const next = modes[(modes.indexOf(s.viewMode) + 1) % modes.length]
      return { viewMode: next, is3DVisible: next !== '2d-only' }
    }),
  resetView: () => set({ scale: 1, offsetX: 0, offsetY: 0 }),
  setStageRef: (stageRef) => set({ stageRef }),
  setCurrentStorey: (currentStoreyId) => set({ currentStoreyId }),
  setStoreyHeight: (storeyHeight) => set({ storeyHeight }),
}))
