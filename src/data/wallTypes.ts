import { WallTypeDefinition } from '../types/walls'

export const WALL_TYPES: WallTypeDefinition[] = [
  // --- YTTERVEGGER ---
  {
    id: 'YV1',
    category: 'YV',
    name: 'Yttervegg 198mm bindingsverk',
    description: 'Standard yttervegg med 198mm stenderverk og mineralull',
    totalThickness: 261,
    fireRating: 'none',
    loadBearing: true,
    tek17Reference: '§14-3',
    layers: [
      { name: 'Utvendig kledning', thickness: 23, material: 'cladding_vertical', color: '#c8a882' },
      { name: 'Luftlomme', thickness: 25, material: 'air_gap', color: '#d0e8f0' },
      { name: 'Vindsperre', thickness: 13, material: 'wind_barrier', color: '#e8e0c8' },
      { name: 'Stenderverk + mineralull 198mm', thickness: 198, material: 'mineral_wool', color: '#f0c060' },
      { name: 'Dampsperre', thickness: 0, material: 'vapour_barrier', color: '#a0c0a0' },
      { name: 'Innvendig gips 13mm', thickness: 13, material: 'gypsum_standard', color: '#f0f0f0' },
    ],
  },
  {
    id: 'YV2',
    category: 'YV',
    name: 'Yttervegg 148mm bindingsverk',
    description: 'Lettere yttervegg med 148mm stenderverk',
    totalThickness: 210,
    fireRating: 'none',
    loadBearing: true,
    tek17Reference: '§14-3',
    layers: [
      { name: 'Utvendig kledning', thickness: 23, material: 'cladding_vertical', color: '#c8a882' },
      { name: 'Luftlomme', thickness: 25, material: 'air_gap', color: '#d0e8f0' },
      { name: 'Vindsperre', thickness: 9, material: 'wind_barrier', color: '#e8e0c8' },
      { name: 'Stenderverk + mineralull 148mm', thickness: 148, material: 'mineral_wool', color: '#f0c060' },
      { name: 'Dampsperre', thickness: 0, material: 'vapour_barrier', color: '#a0c0a0' },
      { name: 'Innvendig gips 13mm', thickness: 13, material: 'gypsum_standard', color: '#f0f0f0' },
    ],
  },
  {
    id: 'YV3',
    category: 'YV',
    name: 'Massivtre/Laft 200mm',
    description: 'Massiv trevegg, laftet eller limtre',
    totalThickness: 200,
    fireRating: 'none',
    loadBearing: true,
    tek17Reference: '§14-3',
    layers: [
      { name: 'Massivtre 200mm', thickness: 200, material: 'solid_timber', color: '#c8904a' },
    ],
  },
  {
    id: 'YV4',
    category: 'YV',
    name: 'Betong yttervegg 200mm',
    description: 'Betong yttervegg med isolasjon',
    totalThickness: 200,
    fireRating: 'none',
    loadBearing: true,
    tek17Reference: '§14-3',
    layers: [
      { name: 'Betong 200mm', thickness: 200, material: 'concrete', color: '#a0a0a0' },
    ],
  },

  // --- INNERVEGGER ---
  {
    id: 'IV1',
    category: 'IV',
    name: 'Gipsvegg lett 98mm',
    description: '2×12,5mm gips + 98mm bindingsverk',
    totalThickness: 123,
    fireRating: 'none',
    loadBearing: false,
    tek17Reference: '',
    layers: [
      { name: 'Gips 12,5mm', thickness: 13, material: 'gypsum_standard', color: '#f0f0f0' },
      { name: 'Stenderverk 98mm', thickness: 98, material: 'timber_stud', color: '#d4a870' },
      { name: 'Gips 12,5mm', thickness: 13, material: 'gypsum_standard', color: '#f0f0f0' },
    ],
  },
  {
    id: 'IV2',
    category: 'IV',
    name: 'Gipsvegg dobbel EI60',
    description: 'Dobbel gips på begge sider, 60 min brannmotstand',
    totalThickness: 148,
    fireRating: 'EI60',
    loadBearing: false,
    tek17Reference: '§11-4',
    layers: [
      { name: 'Branngips 2×15mm', thickness: 25, material: 'gypsum_fire', color: '#e8d8d8' },
      { name: 'Stenderverk + mineralull 98mm', thickness: 98, material: 'mineral_wool', color: '#f0c060' },
      { name: 'Branngips 2×15mm', thickness: 25, material: 'gypsum_fire', color: '#e8d8d8' },
    ],
  },
  {
    id: 'IV3',
    category: 'IV',
    name: 'Murverk/tegl 150mm',
    description: 'Murvegg av teglstein',
    totalThickness: 150,
    fireRating: 'EI60',
    loadBearing: true,
    tek17Reference: '',
    layers: [
      { name: 'Tegl 150mm', thickness: 150, material: 'brick_masonry', color: '#b05030' },
    ],
  },
  {
    id: 'IV4',
    category: 'IV',
    name: 'Betong innerveg 150mm',
    description: 'Støpt betong innerveg',
    totalThickness: 150,
    fireRating: 'EI90',
    loadBearing: true,
    tek17Reference: '',
    layers: [
      { name: 'Betong 150mm', thickness: 150, material: 'concrete', color: '#909090' },
    ],
  },

  // --- BRANNVEGGER ---
  {
    id: 'BV1',
    category: 'BV',
    name: 'Brannvegg EI30',
    description: '30 minutters brannmotstand',
    totalThickness: 123,
    fireRating: 'EI30',
    loadBearing: false,
    tek17Reference: '§11-4',
    layers: [
      { name: 'Branngips 15mm', thickness: 15, material: 'gypsum_fire', color: '#e8c0c0' },
      { name: 'Stenderverk + mineralull 98mm', thickness: 98, material: 'mineral_wool', color: '#f0c060' },
      { name: 'Branngips 15mm', thickness: 15, material: 'gypsum_fire', color: '#e8c0c0' },
    ],
  },
  {
    id: 'BV2',
    category: 'BV',
    name: 'Brannvegg EI60',
    description: '60 minutters brannmotstand',
    totalThickness: 148,
    fireRating: 'EI60',
    loadBearing: false,
    tek17Reference: '§11-4',
    layers: [
      { name: 'Branngips 2×15mm', thickness: 25, material: 'gypsum_fire', color: '#e8b0b0' },
      { name: 'Stenderverk + mineralull 98mm', thickness: 98, material: 'mineral_wool', color: '#f0c060' },
      { name: 'Branngips 2×15mm', thickness: 25, material: 'gypsum_fire', color: '#e8b0b0' },
    ],
  },
  {
    id: 'BV3',
    category: 'BV',
    name: 'Brannvegg EI90',
    description: '90 minutters brannmotstand',
    totalThickness: 200,
    fireRating: 'EI90',
    loadBearing: true,
    tek17Reference: '§11-4',
    layers: [
      { name: 'Branngips 3×15mm', thickness: 40, material: 'gypsum_fire', color: '#e8a0a0' },
      { name: 'Betong 120mm', thickness: 120, material: 'concrete', color: '#909090' },
      { name: 'Branngips 3×15mm', thickness: 40, material: 'gypsum_fire', color: '#e8a0a0' },
    ],
  },
  {
    id: 'BV4',
    category: 'BV',
    name: 'Bærende brannvegg REI120',
    description: 'Bærende vegg med 120 min brannmotstand',
    totalThickness: 250,
    fireRating: 'REI120',
    loadBearing: true,
    tek17Reference: '§11-4',
    layers: [
      { name: 'Betong 250mm', thickness: 250, material: 'concrete', color: '#808080' },
    ],
  },

  // --- SKILLEVEGGER ---
  {
    id: 'SV1',
    category: 'SV',
    name: 'Skillevegg enkel gips',
    description: 'Enkel ikke-bærende gipsvegg',
    totalThickness: 73,
    fireRating: 'none',
    loadBearing: false,
    tek17Reference: '',
    layers: [
      { name: 'Gips 12,5mm', thickness: 13, material: 'gypsum_standard', color: '#f0f0f0' },
      { name: 'Stenderverk 48mm', thickness: 48, material: 'timber_stud', color: '#d4a870' },
      { name: 'Gips 12,5mm', thickness: 13, material: 'gypsum_standard', color: '#f0f0f0' },
    ],
  },
  {
    id: 'SV2',
    category: 'SV',
    name: 'Glassvegg/partisjon',
    description: 'Glassvegg for kontorlandskap',
    totalThickness: 80,
    fireRating: 'none',
    loadBearing: false,
    tek17Reference: '',
    layers: [
      { name: 'Glass 80mm', thickness: 80, material: 'air_gap', color: '#c0e0f8' },
    ],
  },
]

export const WALL_TYPE_MAP: Record<string, WallTypeDefinition> =
  Object.fromEntries(WALL_TYPES.map((wt) => [wt.id, wt]))

export const CATEGORY_LABELS: Record<string, string> = {
  YV: 'Yttervegger',
  IV: 'Innervegger',
  BV: 'Brannvegger',
  SV: 'Skillevegger',
}
