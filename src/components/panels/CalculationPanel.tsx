import React, { useMemo } from 'react'
import { useDrawingStore } from '../../store/drawingStore'
import { useWallStore } from '../../store/wallStore'
import { WALL_TYPES, WALL_TYPE_MAP } from '../../data/wallTypes'
import { WallElement } from '../../types/drawing'
import { calculateUValue } from '../../utils/uValueCalc'
import { distance } from '../../utils/wallGeometry'
import styles from './CalculationPanel.module.css'

export default function CalculationPanel(): React.ReactElement {
  const { elements } = useDrawingStore()
  const { wallInstances } = useWallStore()

  const walls = elements.filter((e): e is WallElement => e.type === 'wall')

  // Per-type statistics: count, total length, and total wall face area
  const stats = useMemo(() => {
    const byType: Record<string, { count: number; totalLengthMm: number; totalAreaMm2: number }> = {}

    for (const wall of walls) {
      const instance = wallInstances[wall.id]
      const typeId = instance?.wallTypeId ?? wall.wallTypeId
      const wallType = WALL_TYPE_MAP[typeId]
      if (!wallType) continue

      const len = distance(wall.centerline.start, wall.centerline.end)
      // Default storey height 2400mm when not set per instance
      const height = (instance as { height?: number } | undefined)?.height ?? 2400
      const area = len * height

      if (!byType[typeId]) byType[typeId] = { count: 0, totalLengthMm: 0, totalAreaMm2: 0 }
      byType[typeId].count++
      byType[typeId].totalLengthMm += len
      byType[typeId].totalAreaMm2 += area
    }

    return byType
  }, [walls, wallInstances])

  // U-values computed once from the static wall type library
  const uValues = useMemo(() => WALL_TYPES.map((wt) => calculateUValue(wt)), [])

  const totalWalls = walls.length
  const totalLengthM = walls.reduce(
    (sum, w) => sum + distance(w.centerline.start, w.centerline.end) / 1000,
    0
  )

  return (
    <div className={styles.panel}>
      <div className={styles.title}>Kalkulasjoner</div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Sammendrag</div>
        <div className={styles.row}>
          <span>Antall vegger</span>
          <span>{totalWalls}</span>
        </div>
        <div className={styles.row}>
          <span>Total vegg-lengde</span>
          <span>{totalLengthM.toFixed(1)} m</span>
        </div>
      </div>

      {Object.keys(stats).length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Vegger per type</div>
          {Object.entries(stats).map(([typeId, s]) => {
            const wallType = WALL_TYPE_MAP[typeId]
            return (
              <div key={typeId} className={styles.wallTypeStat}>
                <div className={styles.wallTypeHeader}>
                  <span className={styles.typeId}>{typeId}</span>
                  <span className={styles.typeName}>{wallType?.name}</span>
                </div>
                <div className={styles.row}>
                  <span>Antall</span>
                  <span>{s.count} stk</span>
                </div>
                <div className={styles.row}>
                  <span>Total lengde</span>
                  <span>{(s.totalLengthMm / 1000).toFixed(2)} m</span>
                </div>
                <div className={styles.row}>
                  <span>Vegg-areal</span>
                  <span>{(s.totalAreaMm2 / 1e6).toFixed(1)} m²</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className={styles.section}>
        <div className={styles.sectionTitle}>U-verdier</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>U-verdi</th>
              <th>Rt</th>
            </tr>
          </thead>
          <tbody>
            {uValues.map((uv) => {
              const wt = WALL_TYPE_MAP[uv.wallTypeId]
              // TEK17 krav: yttervegger ≤ 0.18, innervegger/andre ≤ 0.50
              const isTek17Ok = wt?.category === 'YV' ? uv.uValue <= 0.18 : uv.uValue <= 0.50
              return (
                <tr key={uv.wallTypeId}>
                  <td>{uv.wallTypeId}</td>
                  <td className={isTek17Ok ? styles.uGood : styles.uBad}>
                    {uv.uValue.toFixed(3)} W/m²K
                  </td>
                  <td>{uv.rTotal} m²K/W</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className={styles.disclaimer}>
          U-verdier beregnet etter forenklet ISO 6946 uten kuldebrofaktor. Ikke for TEK17-dokumentasjon.
        </div>
      </div>
    </div>
  )
}
