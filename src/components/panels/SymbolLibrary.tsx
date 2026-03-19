import React, { useState } from 'react'
import { SYMBOLS, SYMBOL_CATEGORIES } from '../../data/symbols'
import styles from './SymbolLibrary.module.css'

interface Props {
  onSelect: (symbolId: string) => void
}

export default function SymbolLibrary({ onSelect }: Props): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState('Møbler')

  return (
    <div className={styles.panel}>
      <div className={styles.title}>Symbolbibliotek</div>

      <div className={styles.categories}>
        {SYMBOL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.catBtn} ${activeCategory === cat ? styles.active : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {SYMBOLS.filter((s) => s.category === activeCategory).map((sym) => (
          <button
            key={sym.id}
            className={styles.symbolBtn}
            onClick={() => onSelect(sym.id)}
            title={`${sym.name} (${sym.widthMm}×${sym.heightMm}mm)`}
          >
            <span className={styles.symName}>{sym.name}</span>
            <span className={styles.symSize}>{sym.widthMm}×{sym.heightMm}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
