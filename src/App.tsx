import React from 'react'
import styles from './App.module.css'

export default function App(): React.ReactElement {
  return (
    <div className={styles.app}>
      <div className={styles.toolbar}>
        <span className={styles.logo}>Archdraw</span>
      </div>
      <div className={styles.workspace}>
        <div className={styles.canvas}>
          <p>Canvas kommer her — Fase 1</p>
        </div>
      </div>
      <div className={styles.statusbar}>
        Klar
      </div>
    </div>
  )
}
