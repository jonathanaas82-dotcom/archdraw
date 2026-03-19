import React from 'react'
import { Layer, Line, Arrow, Text, Group } from 'react-konva'
import { useDrawingStore } from '../../store/drawingStore'
import { useWallStore } from '../../store/wallStore'
import { useViewStore } from '../../store/viewStore'
import { WALL_TYPE_MAP } from '../../data/wallTypes'
import { WallElement } from '../../types/drawing'
import { flatPoints, applyMiterJoins, distance } from '../../utils/wallGeometry'

interface WallShapeProps {
  wall: WallElement
}

function WallShape({ wall }: WallShapeProps): React.ReactElement {
  const { wallInstances } = useWallStore()
  const { scale } = useViewStore()
  const instance = wallInstances[wall.id]
  const wallType = WALL_TYPE_MAP[instance?.wallTypeId ?? wall.wallTypeId]

  const fillColor = wallType?.layers[0]?.color ?? '#888888'
  const hasFire = wallType?.fireRating !== 'none' && wallType?.fireRating !== undefined

  const { start, end } = wall.centerline
  const lenMm = Math.round(distance(start, end))
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2

  const fontSize = 10 / scale
  const arrowSize = 5 / scale
  const strokeW = 0.8 / scale
  const label = `${lenMm} mm`

  return (
    <Group listening={false}>
      {/* Wall polygon */}
      <Line
        points={flatPoints(wall.points)}
        closed
        fill={fillColor}
        stroke={hasFire ? '#cc4444' : '#555555'}
        strokeWidth={1}
        listening={false}
      />
      {/* Dimension arrow along centerline */}
      <Arrow
        points={[start.x, start.y, end.x, end.y]}
        stroke="#aaaaaa"
        fill="#aaaaaa"
        strokeWidth={strokeW}
        pointerLength={arrowSize}
        pointerWidth={arrowSize}
        pointerAtBeginning
        pointerAtEnding
        dash={[6 / scale, 3 / scale]}
        listening={false}
      />
      {/* Length label — centered on wall */}
      <Text
        x={midX}
        y={midY}
        text={label}
        fontSize={fontSize}
        fill="#ffffff"
        align="center"
        offsetX={label.length * fontSize * 0.3}
        offsetY={fontSize / 2}
        listening={false}
      />
    </Group>
  )
}

export default function WallLayer(): React.ReactElement {
  const { elements } = useDrawingStore()
  const rawWalls = elements.filter((e): e is WallElement => e.type === 'wall')
  // Apply miter joins for clean corner rendering (does not mutate store data)
  const mitered = applyMiterJoins(rawWalls)

  return (
    <Layer listening={false}>
      {mitered.map((wall) => (
        <WallShape key={wall.id} wall={wall} />
      ))}
    </Layer>
  )
}
