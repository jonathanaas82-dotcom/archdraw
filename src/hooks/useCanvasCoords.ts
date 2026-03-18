import { useViewStore } from '../store/viewStore'
import { Point2D } from '../types/drawing'

// 1 px = 1 mm at scale 1 (we treat pixels as mm in world space)
export function useCanvasCoords() {
  const { scale, offsetX, offsetY } = useViewStore()

  const screenToWorld = (screenX: number, screenY: number): Point2D => ({
    x: (screenX - offsetX) / scale,
    y: (screenY - offsetY) / scale,
  })

  const worldToScreen = (worldX: number, worldY: number): Point2D => ({
    x: worldX * scale + offsetX,
    y: worldY * scale + offsetY,
  })

  return { screenToWorld, worldToScreen }
}
