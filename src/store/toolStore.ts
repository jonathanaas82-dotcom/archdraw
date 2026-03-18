import { create } from 'zustand'
import { ToolType } from '../types/tools'

interface ToolState {
  activeTool: ToolType
  setTool: (tool: ToolType) => void
}

export const useToolStore = create<ToolState>((set) => ({
  activeTool: 'select',
  setTool: (activeTool) => set({ activeTool }),
}))
