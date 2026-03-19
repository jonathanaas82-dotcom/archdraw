export type WallMaterial =
  | 'timber_stud'
  | 'mineral_wool'
  | 'vapour_barrier'
  | 'gypsum_standard'
  | 'gypsum_fire'
  | 'concrete'
  | 'brick_masonry'
  | 'cladding_vertical'
  | 'air_gap'
  | 'wind_barrier'
  | 'solid_timber'
  | 'eps'

export type WallCategory = 'YV' | 'IV' | 'BV' | 'SV'
export type FireRating = 'none' | 'EI30' | 'EI60' | 'EI90' | 'REI120'

export interface WallLayer {
  name: string
  thickness: number   // mm
  material: WallMaterial
  color: string       // hex
}

export interface WallTypeDefinition {
  id: string
  category: WallCategory
  name: string
  description: string
  totalThickness: number  // mm
  layers: WallLayer[]
  fireRating: FireRating
  loadBearing: boolean
  tek17Reference: string
}

export interface WallInstance {
  id: string          // same as WallElement.id
  wallTypeId: string
  length: number      // mm
  height: number      // mm, default 2400
}
