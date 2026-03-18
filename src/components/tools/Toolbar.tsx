import React from 'react'
import { useToolStore } from '../../store/toolStore'
import { useViewStore } from '../../store/viewStore'
import { ToolType } from '../../types/tools'
import styles from './Toolbar.module.css'

const TOOLS: { id: ToolType; label: string; shortcut: string }[] = [
  { id: 'select', label: '↖ Velg', shortcut: 'V' },
  { id: 'pan', label: '✋ Pan', shortcut: 'H' },
  { id: 'wall', label: '▭ Vegg', shortcut: 'W' },
  { id: 'door', label: 'Dor', shortcut: 'D' },
  { id: 'window', label: 'Vindu', shortcut: 'U' },
  { id: 'dimension', label: '↔ Mal', shortcut: 'M' },
]

export default function Toolbar(): React.ReactElement {
  const { activeTool, setTool } = useToolStore()
  const { showGrid, snapToGrid, toggleGrid, toggleSnap } = useViewStore()

  return (
    <div className={styles.toolbar}>
      <div className={styles.group}>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`${styles.btn} ${activeTool === t.id ? styles.active : ''}`}
            onClick={() => setTool(t.id)}
            title={`${t.label} (${t.shortcut})`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.group}>
        <button
          className={`${styles.btn} ${showGrid ? styles.active : ''}`}
          onClick={toggleGrid}
          title="Vis/skjul grid (G)"
        >
          Grid
        </button>
        <button
          className={`${styles.btn} ${snapToGrid ? styles.active : ''}`}
          onClick={toggleSnap}
          title="Snap til grid (S)"
        >
          Snap
        </button>
      </div>
    </div>
  )
}
