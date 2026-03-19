import React from 'react'
import { Layer, Line } from 'react-konva'
import { useDrawingStore } from '../../store/drawingStore'
import { useWallStore } from '../../store/wallStore'
import { WALL_TYPE_MAP } from '../../data/wallTypes'
import { WallElement } from '../../types/drawing'
import { flatPoints, applyMiterJoins } from '../../utils/wallGeometry'

interface WallShapeProps {
  wall: WallElement
}

function WallShape({ wall }: WallShapeProps): React.ReactElement {
  const { wallInstances } = useWallStore()
  const instance = wallInstances[wall.id]
  // Prefer the instance's wallTypeId (may differ from element after type changes)
  const wallType = WALL_TYPE_MAP[instance?.wallTypeId ?? wall.wallTypeId]

  // Use the outermost layer color as fill, falling back to a neutral grey
  const fillColor = wallType?.layers[0]?.color ?? '#888888'
  const hasFire = wallType?.fireRating !== 'none' && wallType?.fireRating !== undefined

  return (
    <Line
      points={flatPoints(wall.points)}
      closed
      fill={fillColor}
      stroke={hasFire ? '#cc4444' : '#555555'}
      strokeWidth={1}
      listening={false}
    />
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
