import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useDrawingStore } from '../../store/drawingStore'
import { useWallStore } from '../../store/wallStore'
import { WALL_TYPE_MAP } from '../../data/wallTypes'
import { WallElement, DoorElement, WindowElement } from '../../types/drawing'
import WallMesh from './WallMesh'
import OpeningMesh from './OpeningMesh'

export default function Scene3D(): React.ReactElement {
  const { elements } = useDrawingStore()
  const { wallInstances } = useWallStore()
  const { invalidate } = useThree()

  // Re-render 3D on demand whenever the 2D drawing store changes
  useEffect(() => {
    const unsub = useDrawingStore.subscribe(() => invalidate())
    return unsub
  }, [invalidate])

  const walls = elements.filter((e): e is WallElement => e.type === 'wall')
  const doors = elements.filter((e): e is DoorElement => e.type === 'door')
  const windows = elements.filter((e): e is WindowElement => e.type === 'window')

  return (
    <>
      {walls.map((wall) => {
        const instance = wallInstances[wall.id]
        const wallType = WALL_TYPE_MAP[instance?.wallTypeId ?? wall.wallTypeId]
        // Use the outermost layer's color as the 3D surface color
        const color = wallType?.layers[0]?.color ?? '#888888'
        const height = instance?.height ?? 2400
        return (
          <WallMesh key={wall.id} wall={wall} color={color} height={height} />
        )
      })}
      {doors.map((door) => {
        const wall = walls.find((w) => w.id === door.wallId)
        if (!wall) return null
        const instance = wallInstances[wall.id]
        const wallType = WALL_TYPE_MAP[instance?.wallTypeId ?? wall.wallTypeId]
        const thickness = wallType?.totalThickness ?? wall.thicknessMm
        const height = instance?.height ?? 2400
        return (
          <OpeningMesh key={door.id} opening={door} wall={wall} wallThickness={thickness} wallHeight={height} />
        )
      })}
      {windows.map((win) => {
        const wall = walls.find((w) => w.id === win.wallId)
        if (!wall) return null
        const instance = wallInstances[wall.id]
        const wallType = WALL_TYPE_MAP[instance?.wallTypeId ?? wall.wallTypeId]
        const thickness = wallType?.totalThickness ?? wall.thicknessMm
        const height = instance?.height ?? 2400
        return (
          <OpeningMesh key={win.id} opening={win} wall={wall} wallThickness={thickness} wallHeight={height} />
        )
      })}
    </>
  )
}
