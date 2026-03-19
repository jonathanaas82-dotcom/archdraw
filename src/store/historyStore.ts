import { create } from 'zustand'
import { useDrawingStore } from './drawingStore'
import { useWallStore } from './wallStore'

interface Snapshot {
  elements: unknown
  wallInstances: unknown
}

interface HistoryState {
  past: Snapshot[]
  future: Snapshot[]

  pushSnapshot: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

function takeSnapshot(): Snapshot {
  return {
    elements: JSON.parse(JSON.stringify(useDrawingStore.getState().elements)),
    wallInstances: JSON.parse(JSON.stringify(useWallStore.getState().wallInstances)),
  }
}

function applySnapshot(snapshot: Snapshot): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useDrawingStore.setState({ elements: snapshot.elements as any, selectedIds: [] })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useWallStore.setState({ wallInstances: snapshot.wallInstances as any })
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],

  pushSnapshot: () => {
    const snapshot = takeSnapshot()
    set((s) => ({
      past: [...s.past.slice(-49), snapshot],  // max 50 steps
      future: [],
    }))
  },

  undo: () => {
    const { past } = get()
    if (past.length === 0) return
    const currentSnapshot = takeSnapshot()
    const prev = past[past.length - 1]
    applySnapshot(prev)
    set((s) => ({
      past: s.past.slice(0, -1),
      future: [currentSnapshot, ...s.future],
    }))
  },

  redo: () => {
    const { future } = get()
    if (future.length === 0) return
    const currentSnapshot = takeSnapshot()
    const next = future[0]
    applySnapshot(next)
    set((s) => ({
      past: [...s.past, currentSnapshot],
      future: s.future.slice(1),
    }))
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}))
