import React, { Suspense, lazy } from 'react'
import Toolbar from './components/tools/Toolbar'
import DrawingCanvas from './components/canvas/DrawingCanvas'
import CalculationPanel from './components/panels/CalculationPanel'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useViewStore } from './store/viewStore'
import styles from './App.module.css'

// Lazy-load so Three.js is excluded from the initial bundle (architecture rule 6)
const Viewer3D = lazy(() => import('./components/viewer3d/Viewer3D'))

export default function App(): React.ReactElement {
  useKeyboardShortcuts()

  const { viewMode } = useViewStore()

  return (
    <div className={styles.app}>
      <div className={styles.titlebar}>
        <span className={styles.logo}>Archdraw</span>
        <span className={styles.subtitle}>Byggtegninger</span>
      </div>
      <div className={styles.workspace}>
        <Toolbar />
        {viewMode !== '3d-only' && <DrawingCanvas />}
        {viewMode !== '2d-only' && (
          <Suspense fallback={<div style={{ flex: 1, background: '#111' }} />}>
            <Viewer3D />
          </Suspense>
        )}
        <CalculationPanel />
      </div>
      <div className={styles.statusbar}>
        Klar — Bruk scrollhjul for zoom, midtknapp for pan
      </div>
    </div>
  )
}
