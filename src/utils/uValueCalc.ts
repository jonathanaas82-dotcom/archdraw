import { WallTypeDefinition } from '../types/walls'

// Termisk konduktivitet W/(m·K) per materiale-nøkkel
const LAMBDA: Record<string, number> = {
  timber_stud:         0.14,
  mineral_wool:        0.036,
  cellulose:           0.040,
  eps:                 0.033,
  vapour_barrier:      0.23,
  gypsum_standard:     0.25,
  gypsum_fire:         0.25,
  gypsum_wet:          0.25,
  concrete:            1.7,
  brick_masonry:       0.6,
  cladding_vertical:   0.14,
  cladding_horizontal: 0.14,
  cladding_timber:     0.14,
  air_gap:             0.25,
  wind_barrier:        0.23,
  solid_timber:        0.13,
}

// Overflatemotstandar etter ISO 6946
const RSI = 0.13  // m²K/W — innvendig overflate
const RSE = 0.04  // m²K/W — utvendig overflate

export interface UValueResult {
  wallTypeId: string
  uValue: number    // W/(m²K)
  rTotal: number    // m²K/W
}

/**
 * Beregner U-verdi etter ISO 6946 (forenklet — ingen kuldebrofaktor).
 * Lagtykkelse i mm konverteres til meter internt.
 */
export function calculateUValue(wallType: WallTypeDefinition): UValueResult {
  let rLayers = 0
  for (const layer of wallType.layers) {
    if (layer.thickness <= 0) continue
    // Fallback lambda 0.1 W/(m·K) for ukjente materialer — konsistent med lav konduktivitet
    const lambda = LAMBDA[layer.material] ?? 0.1
    rLayers += (layer.thickness / 1000) / lambda  // mm → m
  }
  const rTotal = RSI + rLayers + RSE
  const uValue = 1 / rTotal

  return {
    wallTypeId: wallType.id,
    uValue: Math.round(uValue * 1000) / 1000,
    rTotal: Math.round(rTotal * 100) / 100,
  }
}
