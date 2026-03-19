import { useEffect } from 'react'
import { useToolStore } from '../store/toolStore'
import { useViewStore } from '../store/viewStore'
import { serializeProject, deserializeProject } from '../utils/serialization'

export function useKeyboardShortcuts(): void {
  const { setTool } = useToolStore()
  const { toggleGrid, toggleSnap, resetView, toggle3DView } = useViewStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      // Ctrl-modified shortcuts
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault()
            {
              const data = JSON.stringify(serializeProject('Mitt prosjekt'), null, 2)
              window.electronAPI.saveFile(data, 'prosjekt.archdraw').catch((err) => {
                console.error('Lagring feilet:', err)
              })
            }
            break
          case 'o':
            e.preventDefault()
            window.electronAPI
              .openFile()
              .then((result) => {
                if (!result) return
                try {
                  const file = JSON.parse(result.content)
                  deserializeProject(file)
                } catch (err) {
                  console.error('Kunne ikke åpne fil:', err)
                }
              })
              .catch((err) => {
                console.error('Åpne fil feilet:', err)
              })
            break
          case '0':
            resetView()
            e.preventDefault()
            break
        }
        return
      }

      switch (e.key.toLowerCase()) {
        case 'v': setTool('select'); break
        case 'h': setTool('pan'); break
        case 'w': setTool('wall'); break
        case 'd': setTool('door'); break
        case 'u': setTool('window'); break
        case 'm': setTool('dimension'); break
        case 'g': toggleGrid(); break
        case 's': toggleSnap(); break
        case 'f3': toggle3DView(); e.preventDefault(); break
        case 'tab':
          if (e.key === 'Tab') { toggle3DView(); e.preventDefault() }
          break
        case 'escape': setTool('select'); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setTool, toggleGrid, toggleSnap, resetView, toggle3DView])
}
