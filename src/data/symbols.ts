export interface SymbolDefinition {
  id: string
  category: string
  name: string
  widthMm: number
  heightMm: number
  draw: (ctx: { x: number; y: number; w: number; h: number }) => SymbolPath[]
}

export interface SymbolPath {
  type: 'rect' | 'circle' | 'line' | 'arc'
  props: Record<string, number | string | boolean>
}

export const SYMBOL_CATEGORIES = ['Møbler', 'Sanitær', 'Kjøkken', 'Trapper']

export const SYMBOLS: SymbolDefinition[] = [
  // MØBLER
  {
    id: 'sofa-2',
    category: 'Møbler',
    name: 'Sofa 2-seter',
    widthMm: 1600,
    heightMm: 800,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h, fill: '#3a3a3a', stroke: '#666', strokeWidth: 1, cornerRadius: 80 } },
      { type: 'rect', props: { x: x + w * 0.05, y: y + h * 0.6, width: w * 0.9, height: h * 0.3, fill: '#444', stroke: '#666', strokeWidth: 1 } },
    ],
  },
  {
    id: 'sofa-3',
    category: 'Møbler',
    name: 'Sofa 3-seter',
    widthMm: 2200,
    heightMm: 850,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h, fill: '#3a3a3a', stroke: '#666', strokeWidth: 1, cornerRadius: 80 } },
      { type: 'rect', props: { x: x + w * 0.05, y: y + h * 0.6, width: w * 0.9, height: h * 0.3, fill: '#444', stroke: '#666', strokeWidth: 1 } },
    ],
  },
  {
    id: 'bed-single',
    category: 'Møbler',
    name: 'Seng enkel',
    widthMm: 900,
    heightMm: 2000,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h, fill: '#2a2a2a', stroke: '#666', strokeWidth: 1 } },
      { type: 'rect', props: { x: x + w * 0.05, y: y + h * 0.05, width: w * 0.9, height: h * 0.2, fill: '#555', stroke: '#666', strokeWidth: 1, cornerRadius: 20 } },
    ],
  },
  {
    id: 'bed-double',
    category: 'Møbler',
    name: 'Seng dobbel',
    widthMm: 1600,
    heightMm: 2000,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h, fill: '#2a2a2a', stroke: '#666', strokeWidth: 1 } },
      { type: 'rect', props: { x: x + w * 0.05, y: y + h * 0.05, width: w * 0.9, height: h * 0.2, fill: '#555', stroke: '#666', strokeWidth: 1, cornerRadius: 20 } },
      { type: 'line', props: { points: [x + w / 2, y, x + w / 2, y + h * 0.9], stroke: '#444', strokeWidth: 1 } },
    ],
  },
  {
    id: 'table-dining',
    category: 'Møbler',
    name: 'Spisebord',
    widthMm: 1200,
    heightMm: 800,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x: x + w * 0.05, y: y + h * 0.05, width: w * 0.9, height: h * 0.9, fill: '#333', stroke: '#777', strokeWidth: 2 } },
    ],
  },
  {
    id: 'desk',
    category: 'Møbler',
    name: 'Skrivebord',
    widthMm: 1400,
    heightMm: 700,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h, fill: '#2e2e2e', stroke: '#666', strokeWidth: 1 } },
    ],
  },

  // SANITÆR
  {
    id: 'toilet',
    category: 'Sanitær',
    name: 'Toalett',
    widthMm: 380,
    heightMm: 680,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h * 0.35, fill: '#555', stroke: '#888', strokeWidth: 1 } },
      { type: 'circle', props: { x: x + w / 2, y: y + h * 0.65, radiusX: w * 0.45, radiusY: h * 0.33, fill: '#444', stroke: '#888', strokeWidth: 1 } },
    ],
  },
  {
    id: 'sink',
    category: 'Sanitær',
    name: 'Servant',
    widthMm: 600,
    heightMm: 500,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h, fill: '#3a3a3a', stroke: '#888', strokeWidth: 1, cornerRadius: 30 } },
      { type: 'circle', props: { x: x + w / 2, y: y + h / 2, radiusX: w * 0.3, radiusY: h * 0.3, fill: '#2a2a2a', stroke: '#666', strokeWidth: 1 } },
    ],
  },
  {
    id: 'shower',
    category: 'Sanitær',
    name: 'Dusj',
    widthMm: 900,
    heightMm: 900,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h, fill: '#2a3a3a', stroke: '#558', strokeWidth: 1 } },
      { type: 'arc', props: { x: x + w * 0.1, y: y + h * 0.1, innerRadius: 0, outerRadius: w * 0.8, angle: 90, fill: 'rgba(100,150,200,0.15)', stroke: '#558', strokeWidth: 1 } },
    ],
  },
  {
    id: 'bathtub',
    category: 'Sanitær',
    name: 'Badekar',
    widthMm: 1700,
    heightMm: 750,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h, fill: '#2a3a3a', stroke: '#558', strokeWidth: 2, cornerRadius: 60 } },
      { type: 'circle', props: { x: x + w * 0.15, y: y + h / 2, radiusX: w * 0.1, radiusY: h * 0.2, fill: '#1a2a2a', stroke: '#446', strokeWidth: 1 } },
    ],
  },

  // KJØKKEN
  {
    id: 'kitchen-sink',
    category: 'Kjøkken',
    name: 'Kjøkkenkum',
    widthMm: 800,
    heightMm: 600,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h, fill: '#3a3a3a', stroke: '#777', strokeWidth: 1 } },
      { type: 'rect', props: { x: x + w * 0.05, y: y + h * 0.1, width: w * 0.42, height: h * 0.8, fill: '#2a2a2a', stroke: '#555', strokeWidth: 1 } },
      { type: 'rect', props: { x: x + w * 0.53, y: y + h * 0.1, width: w * 0.42, height: h * 0.8, fill: '#2a2a2a', stroke: '#555', strokeWidth: 1 } },
    ],
  },
  {
    id: 'stove',
    category: 'Kjøkken',
    name: 'Komfyr',
    widthMm: 600,
    heightMm: 600,
    draw: ({ x, y, w, h }) => [
      { type: 'rect', props: { x, y, width: w, height: h, fill: '#333', stroke: '#666', strokeWidth: 1 } },
      ...([0.25, 0.75].flatMap((cx) =>
        [0.28, 0.72].map((cy) => ({
          type: 'circle' as const,
          props: { x: x + w * cx, y: y + h * cy, radiusX: w * 0.15, radiusY: w * 0.15, stroke: '#888', strokeWidth: 1, fill: '#222' },
        }))
      )),
    ],
  },

  // TRAPPER
  {
    id: 'stair-straight',
    category: 'Trapper',
    name: 'Rett trapp',
    widthMm: 1000,
    heightMm: 2800,
    draw: ({ x, y, w, h }) => {
      const steps = 14
      const stepH = h / steps
      const lines: SymbolPath[] = [
        { type: 'rect', props: { x, y, width: w, height: h, fill: 'transparent', stroke: '#aaa', strokeWidth: 1 } },
      ]
      for (let i = 0; i <= steps; i++) {
        lines.push({ type: 'line', props: { points: [x, y + i * stepH, x + w, y + i * stepH], stroke: i === steps ? '#aaa' : '#666', strokeWidth: i === steps ? 2 : 1 } })
      }
      lines.push({ type: 'line', props: { points: [x + w * 0.1, y + h * 0.5, x + w * 0.5, y + h * 0.05], stroke: '#ffcc44', strokeWidth: 2 } })
      lines.push({ type: 'line', props: { points: [x + w * 0.5, y + h * 0.05, x + w * 0.9, y + h * 0.5], stroke: '#ffcc44', strokeWidth: 2 } })
      return lines
    },
  },
]
