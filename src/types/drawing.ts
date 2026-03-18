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
}

export type DrawingElement = WallElement
