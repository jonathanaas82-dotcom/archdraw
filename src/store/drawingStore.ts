import { create } from 'zustand'
import { DrawingElement } from '../types/drawing'

interface DrawingState {
  elements: DrawingElement[]
  selectedIds: string[]

  addElement: (element: DrawingElement) => void
  removeElement: (id: string) => void
  updateElement: (id: string, patch: Partial<DrawingElement>) => void
  setSelected: (ids: string[]) => void
  clearSelected: () => void
}

export const useDrawingStore = create<DrawingState>((set) => ({
  elements: [],
  selectedIds: [],

  addElement: (element) =>
    set((s) => ({ elements: [...s.elements, element] })),
  removeElement: (id) =>
    set((s) => ({ elements: s.elements.filter((e) => e.id !== id) })),
  updateElement: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })),
  setSelected: (selectedIds) => set({ selectedIds }),
  clearSelected: () => set({ selectedIds: [] }),
}))
