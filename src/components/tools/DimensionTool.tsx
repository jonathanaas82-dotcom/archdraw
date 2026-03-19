import React, { useState, useCallback } from 'react'
import { Layer, Line, Circle, Rect } from 'react-konva'
import Konva from 'konva'
import { useDrawingStore } from '../../store/drawingStore'
import { useViewStore } from '../../store/viewStore'
import { snapToGrid, distance } from '../../utils/wallGeometry'
import { Point2D } from '../../types/drawing'

type Phase = 'idle' | 'started'

export default function DimensionTool(): React.ReactElement {
  const [phase, setPhase] = useState<Phase>('idle')
  const [startPoint, setStartPoint] = useState<Point2D | null>(null)
  const [currentPoint, setCurrentPoint] = useState<Point2D | null>(null)

  const { addElement } = useDrawingStore()
  const { scale, offsetX, offsetY, gridSizeMm, snapToGrid: snapEnabled } = useViewStore()

  const toWorld = (sx: number, sy: number): Point2D => ({
    x: (sx - offsetX) / scale,
    y: (sy - offsetY) / scale,
  })

  const maybeSnap = (p: Point2D): Point2D =>
    snapEnabled ? { x: snapToGrid(p.x, gridSizeMm), y: snapToGrid(p.y, gridSizeMm) } : p

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return
    const stage = e.target.getStage()
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return
    const world = maybeSnap(toWorld(pos.x, pos.y))

    if (phase === 'idle') {
      setStartPoint(world)
      setCurrentPoint(world)
      setPhase('started')
    } else if (phase === 'started' && startPoint) {
      // Only add if the two points are meaningfully apart
      if (distance(startPoint, world) < 1) return
      const id = `dim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      addElement({
        id,
        type: 'dimension',
        layerId: 'default',
        locked: false,
        visible: true,
        startPoint,
        endPoint: world,
        offsetMm: 300,
        textOverride: null,
      })
      setPhase('idle')
      setStartPoint(null)
      setCurrentPoint(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, startPoint, scale, offsetX, offsetY, snapEnabled, gridSizeMm])

  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (phase !== 'started') return
    const stage = e.target.getStage()
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return
    setCurrentPoint(maybeSnap(toWorld(pos.x, pos.y)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, scale, offsetX, offsetY, snapEnabled, gridSizeMm])

  const handleRightClick = useCallback(() => {
    setPhase('idle')
    setStartPoint(null)
    setCurrentPoint(null)
  }, [])

  const showPreview = phase === 'started' && startPoint && currentPoint

  return (
    <Layer onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onContextMenu={handleRightClick}>
      {/* Invisible full-canvas hit area so mouse events reach the layer even on empty space */}
      <Rect x={-100000} y={-100000} width={200000} height={200000} fill="transparent" />
      {showPreview && startPoint && currentPoint && (
        <>
          <Line
            points={[startPoint.x, startPoint.y, currentPoint.x, currentPoint.y]}
            stroke="#ffcc44"
            strokeWidth={1 / scale}
            dash={[8 / scale, 4 / scale]}
            listening={false}
          />
          <Circle x={startPoint.x} y={startPoint.y} radius={3 / scale} fill="#ffcc44" listening={false} />
          <Circle x={currentPoint.x} y={currentPoint.y} radius={3 / scale} fill="#ffcc44" listening={false} />
        </>
      )}
    </Layer>
  )
}
