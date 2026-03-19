import { create } from 'zustand'
import { WallInstance } from '../types/walls'

interface WallStoreState {
  activeWallTypeId: string
  wallInstances: Record<string, WallInstance>

  setActiveWallType: (id: string) => void
  addWallInstance: (instance: WallInstance) => void
  removeWallInstance: (id: string) => void
}

export const useWallStore = create<WallStoreState>((set) => ({
  activeWallTypeId: 'YV1',
  wallInstances: {},

  setActiveWallType: (activeWallTypeId) => set({ activeWallTypeId }),
  addWallInstance: (instance) =>
    set((s) => ({ wallInstances: { ...s.wallInstances, [instance.id]: instance } })),
  removeWallInstance: (id) =>
    set((s) => {
      const next = { ...s.wallInstances }
      delete next[id]
      return { wallInstances: next }
    }),
}))
