import React, { useState } from 'react'
import { WALL_TYPES, CATEGORY_LABELS, WALL_TYPE_MAP } from '../../data/wallTypes'
import { WallCategory } from '../../types/walls'
import styles from './WallTypeDialog.module.css'

interface Props {
  open: boolean
  initialTypeId: string
  onConfirm: (wallTypeId: string, lengthMm: number | null) => void
  onCancel: () => void
}

const CATEGORIES: WallCategory[] = ['YV', 'IV', 'BV', 'SV']

export default function WallTypeDialog({ open, initialTypeId, onConfirm, onCancel }: Props): React.ReactElement | null {
  const [selectedId, setSelectedId] = useState(initialTypeId)
  const [lengthInput, setLengthInput] = useState('')

  if (!open) return null

  const selected = WALL_TYPE_MAP[selectedId]
  const lengthMm = lengthInput ? Math.round(parseFloat(lengthInput) * 1000) : null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onConfirm(selectedId, lengthMm)
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <h2 className={styles.title}>Velg vegg-type</h2>

        <div className={styles.body}>
          {/* Vegg-type liste gruppert per kategori */}
          <div className={styles.list}>
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <div className={styles.categoryLabel}>{CATEGORY_LABELS[cat]}</div>
                {WALL_TYPES.filter((wt) => wt.category === cat).map((wt) => (
                  <button
                    key={wt.id}
                    className={`${styles.typeBtn} ${selectedId === wt.id ? styles.typeBtnActive : ''}`}
                    onClick={() => setSelectedId(wt.id)}
                  >
                    <span className={styles.typeId}>{wt.id}</span>
                    <span className={styles.typeName}>{wt.name}</span>
                    <span className={styles.typeThickness}>{wt.totalThickness}mm</span>
                    {wt.fireRating !== 'none' && (
                      <span className={styles.fireBadge}>{wt.fireRating}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Forhåndsvisning av lag */}
          <div className={styles.preview}>
            <div className={styles.previewTitle}>{selected?.name}</div>
            <div className={styles.previewDesc}>{selected?.description}</div>
            <div className={styles.previewThickness}>
              Totaltykkelse: <strong>{selected?.totalThickness} mm</strong>
            </div>

            {/* Tverrsnitt-visualisering */}
            <div className={styles.crossSection}>
              {selected?.layers.map((layer, i) => (
                <div
                  key={i}
                  className={styles.layer}
                  style={{
                    width: `${Math.max((layer.thickness / selected.totalThickness) * 200, 6)}px`,
                    background: layer.color,
                  }}
                  title={`${layer.name}: ${layer.thickness}mm`}
                >
                  {layer.thickness >= 20 && (
                    <span className={styles.layerLabel}>{layer.thickness}</span>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.layerList}>
              {selected?.layers.map((layer, i) => (
                <div key={i} className={styles.layerItem}>
                  <span className={styles.layerSwatch} style={{ background: layer.color }} />
                  <span>{layer.name}</span>
                  <span className={styles.layerThickness}>{layer.thickness > 0 ? `${layer.thickness}mm` : '\u2014'}</span>
                </div>
              ))}
            </div>

            {/* Valgfri lengde-input */}
            <div className={styles.lengthRow}>
              <label className={styles.lengthLabel}>Lengde (m) \u2014 valgfritt:</label>
              <input
                className={styles.lengthInput}
                type="number"
                min="0.1"
                step="0.1"
                placeholder="f.eks. 3.6"
                value={lengthInput}
                onChange={(e) => setLengthInput(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel}>Avbryt</button>
          <button className={styles.confirmBtn} onClick={() => onConfirm(selectedId, lengthMm)}>
            Bekreft
          </button>
        </div>
      </div>
    </div>
  )
}
