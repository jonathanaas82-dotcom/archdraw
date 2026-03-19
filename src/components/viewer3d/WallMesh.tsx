import React, { useMemo } from 'react'
import * as THREE from 'three'
import { WallElement } from '../../types/drawing'

interface Props {
  wall: WallElement
  color: string
  height: number  // mm
}

export default function WallMesh({ wall, color, height }: Props): React.ReactElement {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    const [p0, p1, p2, p3] = wall.points
    shape.moveTo(p0.x, p0.y)
    shape.lineTo(p1.x, p1.y)
    shape.lineTo(p2.x, p2.y)
    shape.lineTo(p3.x, p3.y)
    shape.closePath()

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: height,
      bevelEnabled: false,
    }
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    // Rotate so wall extends upward (Y in Three.js = up, extrusion is along Z by default)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [wall.points, height])

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshLambertMaterial color={color} />
    </mesh>
  )
}
