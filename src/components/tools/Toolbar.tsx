import React from 'react'
import { useToolStore } from '../../store/toolStore'
import { useViewStore } from '../../store/viewStore'
import { ToolType } from '../../types/tools'
import { serializeProject, deserializeProject } from '../../utils/serialization'
import styles from './Toolbar.module.css'

const TOOLS: { id: ToolType; label: string; shortcut: string }[] = [
  { id: 'select', label: '↖ Velg', shortcut: 'V' },
  { id: 'pan', label: '✋ Pan', shortcut: 'H' },
  { id: 'wall', label: '▭ Vegg', shortcut: 'W' },
  { id: 'door', label: '[D] Dor', shortcut: 'D' },
  { id: 'window', label: '[U] Vindu', shortcut: 'U' },
  { id: 'dimension', label: '↔ Mal', shortcut: 'M' },
]

export default function Toolbar(): React.ReactElement {
  const { activeTool, setTool } = useToolStore()
  const { showGrid, snapToGrid, toggleGrid, toggleSnap } = useViewStore()

  const handleSave = async () => {
    const data = JSON.stringify(serializeProject('Mitt prosjekt'), null, 2)
    await window.electronAPI.saveFile(data, 'prosjekt.archdraw')
  }

  const handleOpen = async () => {
    const result = await window.electronAPI.openFile()
    if (!result) return
    try {
      const file = JSON.parse(result.content)
      deserializeProject(file)
    } catch (e) {
      console.error('Kunne ikke åpne fil:', e)
    }
  }

  // PNG-eksport requires access to the Konva Stage ref from DrawingCanvas.
  // The stage will be wired via a global ref in a future iteration.
  const handleExportPng = async () => {
    console.log('PNG-eksport: kobles til Stage i neste iterasjon')
  }

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

      <div className={styles.divider} />

      <div className={styles.group}>
        <button className={styles.btn} onClick={handleSave} title="Lagre prosjekt (Ctrl+S)">
          Lagre
        </button>
        <button className={styles.btn} onClick={handleOpen} title="Åpne prosjekt (Ctrl+O)">
          Åpne
        </button>
        <button className={styles.btn} onClick={handleExportPng} title="Eksporter PNG">
          PNG
        </button>
      </div>
    </div>
  )
}
