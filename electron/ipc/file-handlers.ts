import { ipcMain, dialog, app } from 'electron'
import fs from 'fs'

export function registerFileHandlers(): void {
  ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Åpne Archdraw-prosjekt',
      filters: [{ name: 'Archdraw-prosjekt', extensions: ['archdraw'] }],
      properties: ['openFile'],
    })
    if (result.canceled || result.filePaths.length === 0) return null
    const filePath = result.filePaths[0]
    const content = fs.readFileSync(filePath, 'utf-8')
    return { content, filePath }
  })

  ipcMain.handle('dialog:saveFile', async (_event, data: string, suggestedName?: string) => {
    const result = await dialog.showSaveDialog({
      title: 'Lagre Archdraw-prosjekt',
      defaultPath: suggestedName ?? 'prosjekt.archdraw',
      filters: [{ name: 'Archdraw-prosjekt', extensions: ['archdraw'] }],
    })
    if (result.canceled || !result.filePath) return null
    fs.writeFileSync(result.filePath, data, 'utf-8')
    return result.filePath
  })

  ipcMain.handle('app:getVersion', () => app.getVersion())
}
