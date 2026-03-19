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

// Beregn absolutt posisjon og vinkel langs en vegg
export function positionOnWall(
  wall: WallElement,
  t: number  // 0-1 langs senterlinjen
): { position: Point2D; angleDeg: number; perpAngleDeg: number } {
  const { start, end } = wall.centerline
  const position: Point2D = {
    x: start.x + (end.x - start.x) * t,
    y: start.y + (end.y - start.y) * t,
  }
  const dx = end.x - start.x
  const dy = end.y - start.y
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
  const perpAngleDeg = angleDeg + 90
  return { position, angleDeg, perpAngleDeg }
}

// Finn nærmeste vegg til et punkt, og t-verdi langs den veggen
export function findNearestWall(
  point: Point2D,
  walls: WallElement[],
  maxDistanceMm: number = 500
): { wall: WallElement; t: number; distance: number } | null {
  let best: { wall: WallElement; t: number; distance: number } | null = null

  for (const wall of walls) {
    const { start, end } = wall.centerline
    const dx = end.x - start.x
    const dy = end.y - start.y
    const lenSq = dx * dx + dy * dy
    if (lenSq === 0) continue

    // Project point onto line segment, clamped to avoid edges (0.05–0.95)
    const t = Math.max(0.05, Math.min(0.95, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq))
    const closestX = start.x + t * dx
    const closestY = start.y + t * dy
    const dist = Math.sqrt((point.x - closestX) ** 2 + (point.y - closestY) ** 2)

    if (dist < maxDistanceMm && (!best || dist < best.distance)) {
      best = { wall, t, distance: dist }
    }
  }

  return best
}
