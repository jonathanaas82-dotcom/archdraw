import { DrawingElement } from './drawing'
import { WallInstance } from './walls'

export interface ProjectFile {
  version: 2
  name: string
  createdAt: string      // ISO date
  updatedAt: string
  elements: DrawingElement[]
  wallInstances: Record<string, WallInstance>
  globalFacadeColor: string
  metadata: {
    gridSizeMm: number
    defaultStoreyHeightMm: number
  }
}
