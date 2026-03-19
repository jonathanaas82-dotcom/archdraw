import Konva from 'konva'
import { generateDXF } from './dxfExport'
import { useDrawingStore } from '../store/drawingStore'

declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<{ content: string; filePath: string } | null>
      saveFile: (data: string, name?: string) => Promise<string | null>
      savePng: (dataUrl: string, name?: string) => Promise<string | null>
      saveDxf: (content: string, name?: string) => Promise<string | null>
      getVersion: () => Promise<string>
    }
  }
}

export async function exportToPng(stage: Konva.Stage, name = 'tegning'): Promise<void> {
  const dataUrl = stage.toDataURL({ pixelRatio: 3 })
  await window.electronAPI.savePng(dataUrl, `${name}.png`)
}

export async function exportToDxf(name = 'tegning'): Promise<void> {
  const { elements } = useDrawingStore.getState()
  const dxfContent = generateDXF(elements)
  await window.electronAPI.saveDxf(dxfContent, `${name}.dxf`)
}
