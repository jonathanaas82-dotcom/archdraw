import { DrawingElement, WallElement } from '../types/drawing'

// Minimal DXF R12 generator — no external dependency required
function dxfHeader(): string {
  return `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n`
}

function dxfEntitiesStart(): string {
  return `0\nSECTION\n2\nENTITIES\n`
}

function dxfEntitiesEnd(): string {
  return `0\nENDSEC\n0\nEOF\n`
}

// Converts mm world coordinates to meters for DXF (1 DXF unit = 1m)
// DXF Y axis is inverted relative to screen Y-down convention
function dxfLine(x1: number, y1: number, x2: number, y2: number, layer = '0'): string {
  return (
    `0\nLINE\n8\n${layer}\n` +
    `10\n${(x1 / 1000).toFixed(4)}\n20\n${(-y1 / 1000).toFixed(4)}\n30\n0.0\n` +
    `11\n${(x2 / 1000).toFixed(4)}\n21\n${(-y2 / 1000).toFixed(4)}\n31\n0.0\n`
  )
}

// Closed LWPOLYLINE — draws the 4-point wall polygon outline
function dxfPolyline(points: number[][], layer = '0'): string {
  let out = `0\nLWPOLYLINE\n8\n${layer}\n90\n${points.length}\n70\n1\n`
  for (const [x, y] of points) {
    out += `10\n${(x / 1000).toFixed(4)}\n20\n${(-y / 1000).toFixed(4)}\n`
  }
  return out
}

export function generateDXF(elements: DrawingElement[]): string {
  const walls = elements.filter((e): e is WallElement => e.type === 'wall')

  let entities = ''

  for (const wall of walls) {
    // Wall outline polygon
    const pts = wall.points.map((p) => [p.x, p.y])
    entities += dxfPolyline(pts, 'VEGGER')

    // Centerline on a separate layer
    entities += dxfLine(
      wall.centerline.start.x, wall.centerline.start.y,
      wall.centerline.end.x, wall.centerline.end.y,
      'SENTERLINJER'
    )
  }

  return dxfHeader() + dxfEntitiesStart() + entities + dxfEntitiesEnd()
}
