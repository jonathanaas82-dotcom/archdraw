import { ipcMain, dialog } from 'electron'
import fs from 'fs'

export function registerExportHandlers(): void {
  ipcMain.handle('export:savePng', async (_event, dataUrl: string, suggestedName?: string) => {
    const result = await dialog.showSaveDialog({
      title: 'Eksporter som PNG',
      defaultPath: suggestedName ?? 'tegning.png',
      filters: [{ name: 'PNG-bilde', extensions: ['png'] }],
    })
    if (result.canceled || !result.filePath) return null
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '')
    fs.writeFileSync(result.filePath, Buffer.from(base64, 'base64'))
    return result.filePath
  })

  ipcMain.handle('export:saveDxf', async (_event, content: string, suggestedName?: string) => {
    const result = await dialog.showSaveDialog({
      title: 'Eksporter som DXF',
      defaultPath: suggestedName ?? 'tegning.dxf',
      filters: [{ name: 'DXF-fil', extensions: ['dxf'] }],
    })
    if (result.canceled || !result.filePath) return null
    fs.writeFileSync(result.filePath, content, 'utf-8')
    return result.filePath
  })
}
