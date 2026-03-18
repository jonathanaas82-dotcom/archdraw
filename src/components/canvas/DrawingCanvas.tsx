import React, { useRef, useCallback, useEffect, useState } from 'react'
import { Stage } from 'react-konva'
import Konva from 'konva'
import GridLayer from './GridLayer'
import { useViewStore } from '../../store/viewStore'
import { useToolStore } from '../../store/toolStore'
import { useCanvasCoords } from '../../hooks/useCanvasCoords'
import styles from './DrawingCanvas.module.css'

export default function DrawingCanvas(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const [size, setSize] = useState({ width: 800, height: 600 })
  const [cursorWorld, setCursorWorld] = useState({ x: 0, y: 0 })
  const [isPanningState, setIsPanningState] = useState(false)

  const { scale, offsetX, offsetY, setScale, setOffset } = useViewStore()
  const { activeTool } = useToolStore()
  const { screenToWorld } = useCanvasCoords()

  // Track pan state in a ref for synchronous access during mouse events
  const isPanning = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  // Resize observer — keeps Stage sized to its container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setSize({ width: el.clientWidth, height: el.clientHeight })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Scroll to zoom, zooming towards the pointer position
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault()
      const stage = stageRef.current
      if (!stage) return

      const pointer = stage.getPointerPosition()
      if (!pointer) return

      const zoomFactor = e.evt.deltaY < 0 ? 1.1 : 0.9
      const newScale = Math.min(Math.max(scale * zoomFactor, 0.05), 20)

      // Zoom towards the pointer: keep the world point under the cursor fixed
      const newOffsetX = pointer.x - (pointer.x - offsetX) * (newScale / scale)
      const newOffsetY = pointer.y - (pointer.y - offsetY) * (newScale / scale)

      setScale(newScale)
      setOffset(newOffsetX, newOffsetY)
    },
    [scale, offsetX, offsetY, setScale, setOffset]
  )

  // Start pan on middle-button click or when pan tool is active
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt.button === 1 || activeTool === 'pan') {
        isPanning.current = true
        setIsPanningState(true)
        lastPos.current = { x: e.evt.clientX, y: e.evt.clientY }
        e.evt.preventDefault()
      }
    },
    [activeTool]
  )

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current
      if (!stage) return

      // Update world-space cursor coordinates for the status display
      const pointer = stage.getPointerPosition()
      if (pointer) {
        const world = screenToWorld(pointer.x, pointer.y)
        setCursorWorld({ x: Math.round(world.x), y: Math.round(world.y) })
      }

      if (isPanning.current) {
        const dx = e.evt.clientX - lastPos.current.x
        const dy = e.evt.clientY - lastPos.current.y
        lastPos.current = { x: e.evt.clientX, y: e.evt.clientY }
        setOffset(offsetX + dx, offsetY + dy)
      }
    },
    [screenToWorld, offsetX, offsetY, setOffset]
  )

  const handleMouseUp = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt.button === 1 || activeTool === 'pan') {
        isPanning.current = false
        setIsPanningState(false)
      }
    },
    [activeTool]
  )

  const cursor = activeTool === 'pan' || isPanningState ? 'grab' : 'crosshair'

  return (
    <div ref={containerRef} className={styles.container}>
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        x={offsetX}
        y={offsetY}
        scaleX={scale}
        scaleY={scale}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor }}
      >
        <GridLayer width={size.width / scale} height={size.height / scale} />
      </Stage>

      {/* Coordinate and zoom display in status strip */}
      <div className={styles.coords}>
        X: {cursorWorld.x} mm &nbsp; Y: {cursorWorld.y} mm &nbsp;|&nbsp; {Math.round(scale * 100)}%
      </div>
    </div>
  )
}
