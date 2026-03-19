import React from 'react'
import { Layer, Group, Line, Rect } from 'react-konva'
import { useDrawingStore } from '../../store/drawingStore'
import { WindowElement, WallElement } from '../../types/drawing'
import { positionOnWall } from '../../utils/wallGeometry'
import { useWallStore } from '../../store/wallStore'
import { WALL_TYPE_MAP } from '../../data/wallTypes'

function WindowShape({ window: win }: { window: WindowElement }): React.ReactElement | null {
  const { elements } = useDrawingStore()
  const { wallInstances } = useWallStore()
  const wall = elements.find((e): e is WallElement => e.id === win.wallId)
  if (!wall) return null

  const instance = wallInstances[wall.id]
  const wallType = WALL_TYPE_MAP[instance?.wallTypeId ?? wall.wallTypeId]
  const thickness = wallType?.totalThickness ?? wall.thicknessMm

  const { position, angleDeg } = positionOnWall(wall, win.positionAlongWall)
  const w = win.widthMm

  return (
    <Group x={position.x} y={position.y} rotation={angleDeg}>
      {/* Dekker vegg-polygonen med mørk åpningsfarge */}
      <Rect
        x={-w / 2}
        y={-thickness / 2}
        width={w}
        height={thickness}
        fill="#1a2a3a"
        listening={false}
      />
      {/* Tre parallelle horisontale linjer = standard arkitekt vindu-symbol */}
      <Line points={[-w / 2, -thickness / 2, w / 2, -thickness / 2]} stroke="#88bbdd" strokeWidth={2} listening={false} />
      <Line points={[-w / 2, 0, w / 2, 0]} stroke="#88bbdd" strokeWidth={1} listening={false} />
      <Line points={[-w / 2, thickness / 2, w / 2, thickness / 2]} stroke="#88bbdd" strokeWidth={2} listening={false} />
      {/* Karmstokker på sidene */}
      <Line points={[-w / 2, -thickness / 2, -w / 2, thickness / 2]} stroke="#aaaaaa" strokeWidth={2} listening={false} />
      <Line points={[w / 2, -thickness / 2, w / 2, thickness / 2]} stroke="#aaaaaa" strokeWidth={2} listening={false} />
    </Group>
  )
}

export default function WindowLayer(): React.ReactElement {
  const { elements } = useDrawingStore()
  const windows = elements.filter((e): e is WindowElement => e.type === 'window')
  return (
    <Layer listening={false}>
      {windows.map((win) => <WindowShape key={win.id} window={win} />)}
    </Layer>
  )
}
