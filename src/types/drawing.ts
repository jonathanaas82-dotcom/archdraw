export interface Point2D {
  x: number
  y: number
}

export type ElementType = 'wall' | 'door' | 'window' | 'dimension' | 'text'

export interface BaseElement {
  id: string
  type: ElementType
  layerId: string
  locked: boolean
  visible: boolean
}

export interface WallElement extends BaseElement {
  type: 'wall'
  points: [Point2D, Point2D, Point2D, Point2D]
  centerline: { start: Point2D; end: Point2D }
  thicknessMm: number
  wallTypeId: string
  storeyId: string
  length: number  // mm, cached from centerline calculation
}

export interface DoorElement extends BaseElement {
  type: 'door'
  wallId: string          // id til veggen døren sitter i
  positionAlongWall: number  // 0-1, relativ posisjon langs veggsenterlinjen
  widthMm: number         // standard 900mm
  openingAngle: number    // grader, 0-90, hvilken vei buen åpner
  flipSide: boolean       // åpner mot innsiden eller utsiden
}

export interface WindowElement extends BaseElement {
  type: 'window'
  wallId: string
  positionAlongWall: number  // 0-1
  widthMm: number         // standard 1200mm
  sillHeightMm: number    // karmstokkshøyde fra gulv, standard 900mm
}

export type DrawingElement = WallElement | DoorElement | WindowElement
