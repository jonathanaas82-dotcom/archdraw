import React from 'react'
import { DoorElement, WindowElement, WallElement } from '../../types/drawing'
import { positionOnWall } from '../../utils/wallGeometry'

interface Props {
  opening: DoorElement | WindowElement
  wall: WallElement
  wallThickness: number
  wallHeight: number
}

export default function OpeningMesh({ opening, wall, wallThickness, wallHeight }: Props): React.ReactElement {
  const { position, angleDeg } = positionOnWall(wall, opening.positionAlongWall)

  const widthMm = opening.widthMm
  const isDoor = opening.type === 'door'
  const openingHeight = isDoor ? wallHeight : wallHeight * 0.5
  // Windows sit above a sill; doors start at floor level (yOffset = 0)
  const yOffset = isDoor ? 0 : (opening as WindowElement).sillHeightMm

  const color = isDoor ? '#1a0a00' : '#0a1a2a'

  return (
    <mesh
      position={[position.x, yOffset + openingHeight / 2, -position.y]}
      rotation={[0, (-angleDeg * Math.PI) / 180, 0]}
    >
      <boxGeometry args={[widthMm, openingHeight, wallThickness + 20]} />
      <meshLambertMaterial color={color} />
    </mesh>
  )
}
