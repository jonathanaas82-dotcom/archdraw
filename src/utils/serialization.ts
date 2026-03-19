import { ProjectFile } from '../types/project'
import { useDrawingStore } from '../store/drawingStore'
import { useWallStore } from '../store/wallStore'
import { useViewStore } from '../store/viewStore'

export function serializeProject(name: string): ProjectFile {
  const { elements } = useDrawingStore.getState()
  const { wallInstances } = useWallStore.getState()
  const { gridSizeMm } = useViewStore.getState()

  return {
    version: 2,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    elements,
    wallInstances,
    globalFacadeColor: '#E8E0D0',
    metadata: {
      gridSizeMm,
      defaultStoreyHeightMm: 2400,
    },
  }
}

export function deserializeProject(file: ProjectFile): void {
  const { elements, wallInstances, metadata } = file

  useDrawingStore.setState({ elements, selectedIds: [] })
  useWallStore.setState({ wallInstances })
  if (metadata?.gridSizeMm) {
    useViewStore.setState({ gridSizeMm: metadata.gridSizeMm })
  }
}
