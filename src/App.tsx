import React from 'react'
import Toolbar from './components/tools/Toolbar'
import DrawingCanvas from './components/canvas/DrawingCanvas'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import styles from './App.module.css'

export default function App(): React.ReactElement {
  useKeyboardShortcuts()

  return (
    <div className={styles.app}>
      <div className={styles.titlebar}>
        <span className={styles.logo}>Archdraw</span>
        <span className={styles.subtitle}>Byggtegninger</span>
      </div>
      <div className={styles.workspace}>
        <Toolbar />
        <DrawingCanvas />
      </div>
      <div className={styles.statusbar}>
        Klar — Bruk scrollhjul for zoom, midtknapp for pan
      </div>
    </div>
  )
}
