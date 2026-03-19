import React from 'react'
import { Layer, Group, Line, Arc, Rect } from 'react-konva'
import { useDrawingStore } from '../../store/drawingStore'
import { DoorElement, WallElement } from '../../types/drawing'
import { positionOnWall } from '../../utils/wallGeometry'
import { useWallStore } from '../../store/wallStore'
import { WALL_TYPE_MAP } from '../../data/wallTypes'

function DoorShape({ door }: { door: DoorElement }): React.ReactElement | null {
  const { elements } = useDrawingStore()
  const { wallInstances } = useWallStore()
  const wall = elements.find((e): e is WallElement => e.id === door.wallId)
  if (!wall) return null

  const instance = wallInstances[wall.id]
  const wallType = WALL_TYPE_MAP[instance?.wallTypeId ?? wall.wallTypeId]
  const thickness = wallType?.totalThickness ?? wall.thicknessMm

  const { position, angleDeg } = positionOnWall(wall, door.positionAlongWall)
  const w = door.widthMm
  const flip = door.flipSide ? -1 : 1

  return (
    <Group
      x={position.x}
      y={position.y}
      rotation={angleDeg}
    >
      {/* Hvit åpning i veggen — dekker over vegg-polygonen */}
      <Rect
        x={-w / 2}
        y={-thickness / 2}
        width={w}
        height={thickness}
        fill="#1a1a1a"
        listening={false}
      />
      {/* Dørblad */}
      <Line
        points={[flip * (-w / 2), 0, flip * (w / 2), 0]}
        stroke="#cccccc"
        strokeWidth={3}
        listening={false}
      />
      {/* Åpningsbue — viser svingbane */}
      <Arc
        x={flip * (-w / 2)}
        y={0}
        innerRadius={w * 0.98}
        outerRadius={w}
        angle={door.openingAngle}
        rotation={flip > 0 ? 0 : 180 - door.openingAngle}
        stroke="#888888"
        strokeWidth={1}
        fill="rgba(100,150,200,0.08)"
        listening={false}
      />
      {/* Dørkarmen — vertikale streker på sidene */}
      <Line
        points={[-w / 2, -thickness / 2, -w / 2, thickness / 2]}
        stroke="#aaaaaa"
        strokeWidth={2}
        listening={false}
      />
      <Line
        points={[w / 2, -thickness / 2, w / 2, thickness / 2]}
        stroke="#aaaaaa"
        strokeWidth={2}
        listening={false}
      />
    </Group>
  )
}

export default function DoorLayer(): React.ReactElement {
  const { elements } = useDrawingStore()
  const doors = elements.filter((e): e is DoorElement => e.type === 'door')
  return (
    <Layer listening={false}>
      {doors.map((door) => <DoorShape key={door.id} door={door} />)}
    </Layer>
  )
}
