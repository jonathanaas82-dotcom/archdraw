import { create } from 'zustand'

export interface Layer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  color: string
}

interface LayerState {
  layers: Layer[]
  activeLayerId: string

  addLayer: (name: string) => void
  removeLayer: (id: string) => void
  toggleVisibility: (id: string) => void
  toggleLocked: (id: string) => void
  setActiveLayer: (id: string) => void
  renameLayer: (id: string, name: string) => void
}

const DEFAULT_LAYERS: Layer[] = [
  { id: 'walls', name: 'Vegger', visible: true, locked: false, color: '#4fc3f7' },
  { id: 'openings', name: 'Åpninger', visible: true, locked: false, color: '#81c784' },
  { id: 'dimensions', name: 'Mål', visible: true, locked: false, color: '#ffcc44' },
  { id: 'symbols', name: 'Symboler', visible: true, locked: false, color: '#ce93d8' },
]

export const useLayerStore = create<LayerState>((set) => ({
  layers: DEFAULT_LAYERS,
  activeLayerId: 'walls',

  addLayer: (name) =>
    set((s) => ({
      layers: [...s.layers, {
        id: `layer-${Date.now()}`,
        name,
        visible: true,
        locked: false,
        color: '#aaaaaa',
      }],
    })),

  removeLayer: (id) =>
    set((s) => ({
      layers: s.layers.filter((l) => l.id !== id),
    })),

  toggleVisibility: (id) =>
    set((s) => ({
      layers: s.layers.map((l) => l.id === id ? { ...l, visible: !l.visible } : l),
    })),

  toggleLocked: (id) =>
    set((s) => ({
      layers: s.layers.map((l) => l.id === id ? { ...l, locked: !l.locked } : l),
    })),

  setActiveLayer: (activeLayerId) => set({ activeLayerId }),

  renameLayer: (id, name) =>
    set((s) => ({
      layers: s.layers.map((l) => l.id === id ? { ...l, name } : l),
    })),
}))
