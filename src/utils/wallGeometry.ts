import { Point2D, WallElement } from '../types/drawing'

function perpendicular(dx: number, dy: number, length: number): { px: number; py: number } {
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return { px: 0, py: length }
  return { px: (-dy / len) * length, py: (dx / len) * length }
}

export function buildWallPolygon(
  start: Point2D,
  end: Point2D,
  thicknessMm: number,
  wallTypeId: string,
  id: string
): WallElement {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const half = thicknessMm / 2
  const { px, py } = perpendicular(dx, dy, half)

  // 4 corners: outer-start, outer-end, inner-end, inner-start (clockwise)
  const points: [Point2D, Point2D, Point2D, Point2D] = [
    { x: start.x - px, y: start.y - py },
    { x: end.x - px, y: end.y - py },
    { x: end.x + px, y: end.y + py },
    { x: start.x + px, y: start.y + py },
  ]

  const length = Math.round(Math.sqrt(dx * dx + dy * dy))

  return {
    id,
    type: 'wall',
    layerId: 'default',
    locked: false,
    visible: true,
    points,
    centerline: { start, end },
    thicknessMm,
    wallTypeId,
    storeyId: 'storey-1',
    length,
  }
}

export function flatPoints(points: [Point2D, Point2D, Point2D, Point2D]): number[] {
  return points.flatMap((p) => [p.x, p.y])
}

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize
}

export function distance(a: Point2D, b: Point2D): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}
