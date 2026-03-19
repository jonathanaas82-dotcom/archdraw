import React, { useState, useCallback } from 'react'
import { Layer, Line, Circle, Text, Rect } from 'react-konva'
import Konva from 'konva'
import { useDrawingStore } from '../../store/drawingStore'
import { useWallStore } from '../../store/wallStore'
import { useViewStore } from '../../store/viewStore'
import { useHistoryStore } from '../../store/historyStore'
import { buildWallPolygon, snapToGrid, distance } from '../../utils/wallGeometry'
import { WALL_TYPE_MAP } from '../../data/wallTypes'
import { Point2D } from '../../types/drawing'

type Phase = 'idle' | 'drawing'

interface WallToolState {
  phase: Phase
  startPoint: Point2D | null
  currentPoint: Point2D | null
  pendingWallTypeId: string | null
}

interface Props {
  onRequestDialog: (startPoint: Point2D) => void
  dialogConfirmed: { wallTypeId: string; lengthMm: number | null } | null
  onDialogHandled: () => void
}

export default function WallTool({ onRequestDialog, dialogConfirmed, onDialogHandled }: Props): React.ReactElement {
  const [toolState, setToolState] = useState<WallToolState>({
    phase: 'idle',
    startPoint: null,
    currentPoint: null,
    pendingWallTypeId: null,
  })

  const { addElement } = useDrawingStore()
  const { addWallInstance } = useWallStore()
  const { scale, offsetX, offsetY, gridSizeMm, snapToGrid: snapEnabled } = useViewStore()

  const screenToWorld = useCallback((sx: number, sy: number): Point2D => ({
    x: (sx - offsetX) / scale,
    y: (sy - offsetY) / scale,
  }), [scale, offsetX, offsetY])

  const maybeSnap = useCallback((p: Point2D): Point2D => {
    if (!snapEnabled) return p
    return {
      x: snapToGrid(p.x, gridSizeMm),
      y: snapToGrid(p.y, gridSizeMm),
    }
  }, [snapEnabled, gridSizeMm])

  const commitWall = useCallback((start: Point2D, end: Point2D, wallTypeId: string) => {
    const wallType = WALL_TYPE_MAP[wallTypeId]
    if (!wallType) return
    const id = `wall-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const element = buildWallPolygon(start, end, wallType.totalThickness, wallTypeId, id)
    const dist = Math.round(distance(start, end))
    // Snapshot before mutation so this action can be undone
    const { pushSnapshot } = useHistoryStore.getState()
    pushSnapshot()
    addElement(element)
    addWallInstance({ id, wallTypeId, length: dist, height: 2400 })
  }, [addElement, addWallInstance])

  // When dialog confirms, either place with fixed length or enter drawing phase
  React.useEffect(() => {
    if (!dialogConfirmed || !toolState.startPoint) return
    // Only handle if we are waiting for a dialog result (phase is still 'idle' after click)
    if (toolState.phase !== 'idle') return

    const { wallTypeId, lengthMm } = dialogConfirmed
    onDialogHandled()

    if (lengthMm !== null) {
      // Fixed length: place wall horizontally from start point
      const end: Point2D = {
        x: toolState.startPoint.x + lengthMm,
        y: toolState.startPoint.y,
      }
      commitWall(toolState.startPoint, end, wallTypeId)
      setToolState({ phase: 'idle', startPoint: null, currentPoint: null, pendingWallTypeId: null })
    } else {
      // No fixed length: enter rubber-band drawing phase
      setToolState((s) => ({ ...s, phase: 'drawing', pendingWallTypeId: wallTypeId }))
    }
  }, [dialogConfirmed])  // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return
    const stage = e.target.getStage()
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return
    const world = maybeSnap(screenToWorld(pos.x, pos.y))

    if (toolState.phase === 'idle') {
      // First click: record start and open dialog
      setToolState({ phase: 'idle', startPoint: world, currentPoint: world, pendingWallTypeId: null })
      onRequestDialog(world)
    } else if (toolState.phase === 'drawing' && toolState.startPoint && toolState.pendingWallTypeId) {
      // Second click: commit wall, then chain — new wall starts from this end
      commitWall(toolState.startPoint, world, toolState.pendingWallTypeId)
      setToolState({ phase: 'idle', startPoint: world, currentPoint: world, pendingWallTypeId: null })
      onRequestDialog(world)
    }
  }, [toolState, maybeSnap, screenToWorld, onRequestDialog, commitWall])

  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (toolState.phase !== 'drawing') return
    const stage = e.target.getStage()
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return
    const world = maybeSnap(screenToWorld(pos.x, pos.y))
    setToolState((s) => ({ ...s, currentPoint: world }))
  }, [toolState.phase, maybeSnap, screenToWorld])

  const handleRightClick = useCallback(() => {
    // Cancel current wall drawing on right-click
    setToolState({ phase: 'idle', startPoint: null, currentPoint: null, pendingWallTypeId: null })
  }, [])

  const showPreview =
    toolState.phase === 'drawing' &&
    toolState.startPoint !== null &&
    toolState.currentPoint !== null &&
    toolState.pendingWallTypeId !== null

  const previewWallType = toolState.pendingWallTypeId ? WALL_TYPE_MAP[toolState.pendingWallTypeId] : null
  const previewThickness = previewWallType?.totalThickness ?? 100

  const previewLength =
    toolState.startPoint && toolState.currentPoint
      ? Math.round(distance(toolState.startPoint, toolState.currentPoint))
      : 0

  return (
    <Layer
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onContextMenu={handleRightClick}
    >
      {/* Full-canvas hit area so the layer receives all mouse events */}
      <Rect x={-100000} y={-100000} width={200000} height={200000} fill="transparent" />

      {showPreview && toolState.startPoint && toolState.currentPoint && previewWallType && (
        <>
          {/* Wall body preview — semi-transparent filled stroke */}
          <Line
            points={[
              toolState.startPoint.x, toolState.startPoint.y,
              toolState.currentPoint.x, toolState.currentPoint.y,
            ]}
            stroke="#4fc3f7"
            strokeWidth={previewThickness}
            opacity={0.3}
            listening={false}
          />
          {/* Centerline dashed */}
          <Line
            points={[
              toolState.startPoint.x, toolState.startPoint.y,
              toolState.currentPoint.x, toolState.currentPoint.y,
            ]}
            stroke="#4fc3f7"
            strokeWidth={1 / scale}
            dash={[10 / scale, 5 / scale]}
            listening={false}
          />
          {/* Start anchor dot */}
          <Circle
            x={toolState.startPoint.x}
            y={toolState.startPoint.y}
            radius={4 / scale}
            fill="#4fc3f7"
            listening={false}
          />
          {/* End cursor dot */}
          <Circle
            x={toolState.currentPoint.x}
            y={toolState.currentPoint.y}
            radius={4 / scale}
            fill="#fff"
            listening={false}
          />
          {/* Length label at midpoint */}
          <Text
            x={(toolState.startPoint.x + toolState.currentPoint.x) / 2}
            y={(toolState.startPoint.y + toolState.currentPoint.y) / 2 - 16 / scale}
            text={`${previewLength} mm`}
            fontSize={12 / scale}
            fill="#fff"
            align="center"
            listening={false}
          />
        </>
      )}
    </Layer>
  )
}
