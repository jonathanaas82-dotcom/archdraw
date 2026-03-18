import React from 'react'
import { Layer, Line } from 'react-konva'
import { useViewStore } from '../../store/viewStore'

interface GridLayerProps {
  // Visible area in world-space (mm), derived from screen size / scale
  width: number
  height: number
}

export default function GridLayer({ width, height }: GridLayerProps): React.ReactElement | null {
  const { scale, offsetX, offsetY, gridSizeMm, showGrid } = useViewStore()

  if (!showGrid) return null

  // gridSizeMm is already in world-space mm. Check if the rendered size is
  // too small (< 4px on screen) or too large (> 400px on screen).
  const gridPxOnScreen = gridSizeMm * scale
  if (gridPxOnScreen < 4 || gridPxOnScreen > 400) return null

  const lines: React.ReactElement[] = []

  // The Stage has x=offsetX, y=offsetY and scaleX/Y=scale applied.
  // All drawing coordinates here are in world-space (mm).
  // The visible world area starts at worldOriginX = -offsetX / scale
  const worldOriginX = -offsetX / scale
  const worldOriginY = -offsetY / scale

  // Vertical lines — step through world-space grid columns
  const startWorldX = Math.floor(worldOriginX / gridSizeMm) * gridSizeMm
  for (let wx = startWorldX; wx < worldOriginX + width; wx += gridSizeMm) {
    lines.push(
      <Line
        key={`v${wx}`}
        points={[wx, worldOriginY, wx, worldOriginY + height]}
        stroke="#2a2a2a"
        strokeWidth={1 / scale}
        listening={false}
      />
    )
  }

  // Horizontal lines
  const startWorldY = Math.floor(worldOriginY / gridSizeMm) * gridSizeMm
  for (let wy = startWorldY; wy < worldOriginY + height; wy += gridSizeMm) {
    lines.push(
      <Line
        key={`h${wy}`}
        points={[worldOriginX, wy, worldOriginX + width, wy]}
        stroke="#2a2a2a"
        strokeWidth={1 / scale}
        listening={false}
      />
    )
  }

  return <Layer listening={false}>{lines}</Layer>
}
