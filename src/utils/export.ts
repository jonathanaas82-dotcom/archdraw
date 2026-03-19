import Konva from 'konva'

declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<{ content: string; filePath: string } | null>
      saveFile: (data: string, name?: string) => Promise<string | null>
      savePng: (dataUrl: string, name?: string) => Promise<string | null>
      getVersion: () => Promise<string>
    }
  }
}

export async function exportToPng(stage: Konva.Stage, name = 'tegning'): Promise<void> {
  const dataUrl = stage.toDataURL({ pixelRatio: 3 })
  await window.electronAPI.savePng(dataUrl, `${name}.png`)
}
