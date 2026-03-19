import React, { useCallback } from 'react'
import { Layer, Circle } from 'react-konva'
import Konva from 'konva'
import { useDrawingStore } from '../../store/drawingStore'
import { useViewStore } from '../../store/viewStore'
import { useHistoryStore } from '../../store/historyStore'
import { findNearestWall } from '../../utils/wallGeometry'
import { WallElement, WindowElement } from '../../types/drawing'

export default function WindowTool(): React.ReactElement {
  const { elements, addElement } = useDrawingStore()
  const { scale, offsetX, offsetY } = useViewStore()

  const walls = elements.filter((e): e is WallElement => e.type === 'wall')

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return
    const stage = e.target.getStage()
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return

    // Convert screen coordinates to world coordinates (mm)
    const worldX = (pos.x - offsetX) / scale
    const worldY = (pos.y - offsetY) / scale

    const nearest = findNearestWall({ x: worldX, y: worldY }, walls)
    if (!nearest) return

    const win: WindowElement = {
      id: `window-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'window',
      layerId: 'default',
      locked: false,
      visible: true,
      wallId: nearest.wall.id,
      positionAlongWall: nearest.t,
      widthMm: 1200,
      sillHeightMm: 900,
    }
    // Snapshot before mutation so this action can be undone
    useHistoryStore.getState().pushSnapshot()
    addElement(win)
  }, [elements, scale, offsetX, offsetY, addElement, walls])

  return (
    <Layer onMouseDown={handleMouseDown}>
      {/* Invisible hit target covering the full layer */}
      <Circle x={0} y={0} radius={0} opacity={0} />
    </Layer>
  )
}
