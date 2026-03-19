import React, { useState } from 'react'
import { useLayerStore } from '../../store/layerStore'
import styles from './LayerPanel.module.css'

const BUILT_IN_LAYER_IDS = ['walls', 'openings', 'dimensions', 'symbols']

export default function LayerPanel(): React.ReactElement {
  const { layers, activeLayerId, toggleVisibility, toggleLocked, setActiveLayer, addLayer, removeLayer } = useLayerStore()
  const [newLayerName, setNewLayerName] = useState('')

  const handleAdd = () => {
    if (!newLayerName.trim()) return
    addLayer(newLayerName.trim())
    setNewLayerName('')
  }

  return (
    <div className={styles.panel}>
      <div className={styles.title}>Lag</div>

      <div className={styles.list}>
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`${styles.layerRow} ${activeLayerId === layer.id ? styles.active : ''}`}
            onClick={() => setActiveLayer(layer.id)}
          >
            <div className={styles.swatch} style={{ background: layer.color }} />
            <span className={`${styles.name} ${!layer.visible ? styles.hidden : ''}`}>
              {layer.name}
            </span>
            <div className={styles.actions}>
              <button
                className={`${styles.iconBtn} ${!layer.visible ? styles.off : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id) }}
                title={layer.visible ? 'Skjul lag' : 'Vis lag'}
              >
                {layer.visible ? '👁' : '🙈'}
              </button>
              <button
                className={`${styles.iconBtn} ${layer.locked ? styles.locked : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleLocked(layer.id) }}
                title={layer.locked ? 'Lås opp' : 'Lås lag'}
              >
                {layer.locked ? '🔒' : '🔓'}
              </button>
              {!BUILT_IN_LAYER_IDS.includes(layer.id) && (
                <button
                  className={styles.iconBtn}
                  onClick={(e) => { e.stopPropagation(); removeLayer(layer.id) }}
                  title="Slett lag"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.addRow}>
        <input
          className={styles.input}
          placeholder="Nytt lag..."
          value={newLayerName}
          onChange={(e) => setNewLayerName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button className={styles.addBtn} onClick={handleAdd}>+</button>
      </div>
    </div>
  )
}
