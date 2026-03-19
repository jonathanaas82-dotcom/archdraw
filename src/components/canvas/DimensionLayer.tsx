import React from 'react'
import { Layer, Line, Text, Arrow, Group } from 'react-konva'
import { useDrawingStore } from '../../store/drawingStore'
import { DimensionElement } from '../../types/drawing'
import { distance } from '../../utils/wallGeometry'
import { useViewStore } from '../../store/viewStore'

interface DimensionShapeProps {
  dim: DimensionElement
}

function DimensionShape({ dim }: DimensionShapeProps): React.ReactElement {
  const { scale } = useViewStore()
  const { startPoint: s, endPoint: e, offsetMm } = dim

  const dx = e.x - s.x
  const dy = e.y - s.y
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return <></>

  // Perpendicular unit vector scaled to offsetMm for offset direction
  const px = (-dy / len) * offsetMm
  const py = (dx / len) * offsetMm

  // Points on the offset (dimension) line
  const os = { x: s.x + px, y: s.y + py }
  const oe = { x: e.x + px, y: e.y + py }

  // Extension lines run from the original point to slightly past the offset line (1.2×)
  const extFactor = 1.2

  const distMm = Math.round(distance(s, e))
  const label = dim.textOverride ?? `${distMm} mm`

  const midX = (os.x + oe.x) / 2
  const midY = (os.y + oe.y) / 2

  const fontSize = 11 / scale
  const strokeW = 1 / scale
  const arrowSize = 6 / scale

  // Estimate text width for centering: character width ≈ 0.6× font size
  const textOffsetX = label.length * fontSize * 0.3

  return (
    <Group listening={false}>
      {/* Extension line from start point */}
      <Line
        points={[s.x, s.y, s.x + px * extFactor, s.y + py * extFactor]}
        stroke="#ffcc44"
        strokeWidth={strokeW}
      />
      {/* Extension line from end point */}
      <Line
        points={[e.x, e.y, e.x + px * extFactor, e.y + py * extFactor]}
        stroke="#ffcc44"
        strokeWidth={strokeW}
      />
      {/* Dimension line with arrows at both ends */}
      <Arrow
        points={[os.x, os.y, oe.x, oe.y]}
        stroke="#ffcc44"
        fill="#ffcc44"
        strokeWidth={strokeW}
        pointerLength={arrowSize}
        pointerWidth={arrowSize}
        pointerAtBeginning
        pointerAtEnding
      />
      {/* Measurement label centered above the dimension line */}
      <Text
        x={midX}
        y={midY - fontSize * 1.5}
        text={label}
        fontSize={fontSize}
        fill="#ffcc44"
        align="center"
        offsetX={textOffsetX}
      />
    </Group>
  )
}

export default function DimensionLayer(): React.ReactElement {
  const { elements } = useDrawingStore()
  const dims = elements.filter((e): e is DimensionElement => e.type === 'dimension')

  return (
    <Layer listening={false}>
      {dims.map((d) => (
        <DimensionShape key={d.id} dim={d} />
      ))}
    </Layer>
  )
}
