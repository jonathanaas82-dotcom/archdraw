import React, { useCallback } from 'react'
import { Layer, Rect } from 'react-konva'
import Konva from 'konva'
import { useDrawingStore } from '../../store/drawingStore'
import { useViewStore } from '../../store/viewStore'
import { useHistoryStore } from '../../store/historyStore'
import { findNearestWall } from '../../utils/wallGeometry'
import { WallElement, DoorElement } from '../../types/drawing'

export default function DoorTool(): React.ReactElement {
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

    const door: DoorElement = {
      id: `door-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'door',
      layerId: 'default',
      locked: false,
      visible: true,
      wallId: nearest.wall.id,
      positionAlongWall: nearest.t,
      widthMm: 900,
      openingAngle: 90,
      flipSide: false,
    }
    // Snapshot before mutation so this action can be undone
    useHistoryStore.getState().pushSnapshot()
    addElement(door)
  }, [elements, scale, offsetX, offsetY, addElement, walls])

  return (
    <Layer onMouseDown={handleMouseDown}>
      {/* Invisible hit target covering the full layer */}
      <Rect x={-100000} y={-100000} width={200000} height={200000} fill="transparent" />
    </Layer>
  )
}
