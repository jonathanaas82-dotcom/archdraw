import React from 'react'
import { useToolStore } from '../../store/toolStore'
import { useViewStore } from '../../store/viewStore'
import { useHistoryStore } from '../../store/historyStore'
import { ToolType } from '../../types/tools'
import { exportToPng, exportToDxf } from '../../utils/export'
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
  const { showGrid, snapToGrid, toggleGrid, toggleSnap, storeyHeight, setStoreyHeight } = useViewStore()
  const { undo, redo, canUndo, canRedo } = useHistoryStore()

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

  const handleExportPng = async () => {
    const stage = useViewStore.getState().stageRef
    if (!stage) return
    await exportToPng(stage, 'archdraw-tegning')
  }

  return (
    <div className={styles.toolbar}>
      {/* Undo / Redo */}
      <div className={styles.group}>
        <button
          className={styles.btn}
          onClick={undo}
          disabled={!canUndo()}
          title="Angre (Ctrl+Z)"
        >
          ↩ Angre
        </button>
        <button
          className={styles.btn}
          onClick={redo}
          disabled={!canRedo()}
          title="Gjenta (Ctrl+Y)"
        >
          ↪ Gjenta
        </button>
      </div>

      <div className={styles.divider} />

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
        <button className={styles.btn} onClick={() => exportToDxf()} title="Eksporter DXF (AutoCAD)">
          DXF
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.group}>
        <span className={styles.label}>Romhøyde:</span>
        <input
          className={styles.heightInput}
          type="number"
          min={2000}
          max={6000}
          step={100}
          value={storeyHeight}
          onChange={(e) => setStoreyHeight(Number(e.target.value))}
        />
        <span className={styles.unit}>mm</span>
      </div>
    </div>
  )
}
