import { Point2D, WallElement } from '../types/drawing'

// ---------------------------------------------------------------------------
// Miter corner join helpers
// ---------------------------------------------------------------------------

/** Find the intersection of two infinite lines defined by a point and direction. */
function lineIntersection(
  p1: Point2D, d1: Point2D,
  p2: Point2D, d2: Point2D
): Point2D | null {
  const cross = d1.x * d2.y - d1.y * d2.x
  if (Math.abs(cross) < 0.001) return null  // parallel lines

  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const t = (dx * d2.y - dy * d2.x) / cross
  return { x: p1.x + t * d1.x, y: p1.y + t * d1.y }
}

/**
 * Extract edge directions and corners from a 4-point wall polygon.
 * Point layout (clockwise): [p0=outer-start, p1=outer-end, p2=inner-end, p3=inner-start]
 */
function getWallEdges(wall: WallElement) {
  const [p0, p1, p2, p3] = wall.points
  return {
    // Outer edge runs from p0 to p1
    outerDir: { x: p1.x - p0.x, y: p1.y - p0.y },
    // Inner edge runs from p3 to p2 (same direction as outer)
    innerDir: { x: p2.x - p3.x, y: p2.y - p3.y },
    outerStart: p0,
    outerEnd: p1,
    innerStart: p3,
    innerEnd: p2,
  }
}

/**
 * Apply miter joins to a set of walls.  For every pair of walls whose
 * centerline endpoints are within `snapDistanceMm` of each other, the shared
 * corner is adjusted so that the outer and inner edges of both walls meet at
 * a clean miter intersection instead of overlapping or leaving a gap.
 *
 * Returns a new array of wall elements (original elements are not mutated).
 */
export function applyMiterJoins(
  walls: WallElement[],
  snapDistanceMm = 50
): WallElement[] {
  // Deep-copy points so we don't mutate the store values
  const updated = walls.map((w) => ({
    ...w,
    points: [...w.points] as [Point2D, Point2D, Point2D, Point2D],
  }))

  for (let i = 0; i < updated.length; i++) {
    for (let j = i + 1; j < updated.length; j++) {
      const a = updated[i]
      const b = updated[j]

      const aEnds = [
        { t: 'start' as const, cl: a.centerline.start },
        { t: 'end'   as const, cl: a.centerline.end   },
      ]
      const bEnds = [
        { t: 'start' as const, cl: b.centerline.start },
        { t: 'end'   as const, cl: b.centerline.end   },
      ]

      for (const ae of aEnds) {
        for (const be of bEnds) {
          const d = distance(ae.cl, be.cl)
          if (d > snapDistanceMm) continue

          // These two walls meet — compute the miter intersection
          const aEdges = getWallEdges(a)
          const bEdges = getWallEdges(b)

          const outerIntersect = lineIntersection(
            aEdges.outerStart, aEdges.outerDir,
            bEdges.outerStart, bEdges.outerDir
          )
          const innerIntersect = lineIntersection(
            aEdges.innerStart, aEdges.innerDir,
            bEdges.innerStart, bEdges.innerDir
          )

          if (!outerIntersect || !innerIntersect) continue

          // Update the end-corner of wall A
          if (ae.t === 'end') {
            updated[i].points[1] = outerIntersect  // outer-end
            updated[i].points[2] = innerIntersect  // inner-end
          } else {
            updated[i].points[0] = outerIntersect  // outer-start
            updated[i].points[3] = innerIntersect  // inner-start
          }

          // Update the end-corner of wall B
          if (be.t === 'start') {
            updated[j].points[0] = outerIntersect  // outer-start
            updated[j].points[3] = innerIntersect  // inner-start
          } else {
            updated[j].points[1] = outerIntersect  // outer-end
            updated[j].points[2] = innerIntersect  // inner-end
          }
        }
      }
    }
  }

  return updated
}

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
